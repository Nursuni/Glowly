import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Model, ObjectId } from 'mongoose';
import { BoardArticleService } from '../board-article/board-article.service';
import {
  CommentInput,
  CommentsInquiry,
} from '../../libs/dto/comment/comment.input';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { Comments, Comment } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { T } from '../../libs/types/common';
import { lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { ProductService } from '../product/product.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly memberService: MemberService,
    private readonly productService: ProductService,
    private readonly boardArticleService: BoardArticleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * 🔑 Get cache version (for smart invalidation)
   */
  private async getCacheVersion(commentRefId: ObjectId): Promise<number> {
    const versionKey = `comments:version:${commentRefId}`;
    let version = await this.cacheManager.get<number>(versionKey);

    if (!version) {
      version = 1;
      await this.cacheManager.set(versionKey, version);
    }

    return version;
  }

  /**
   * 🔄 Increment version (invalidate cache)
   */
  private async invalidateCache(commentRefId: ObjectId): Promise<void> {
    const versionKey = `comments:version:${commentRefId}`;
    const version = await this.cacheManager.get<number>(versionKey);
    await this.cacheManager.set(versionKey, (version ?? 1) + 1);
  }

  /**
   * ✅ CREATE COMMENT
   */
  public async createComment(
    memberId: ObjectId,
    input: CommentInput,
  ): Promise<Comment> {
    input.memberId = memberId;

    let result = null;
    try {
      result = await this.commentModel.create(input);
    } catch (err) {
      console.log('Error, Service.model:', err.message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }

    switch (input.commentGroup) {
      case CommentGroup.PRODUCT:
        await this.productService.productStatsEditor({
          _id: input.commentRefId,
          targetKey: 'productComments',
          modifier: 1,
        });
        break;
      case CommentGroup.ARTICLE:
        await this.boardArticleService.boardArticleStatsEditor({
          _id: input.commentRefId,
          targetKey: 'articleComments',
          modifier: 1,
        });
        break;
      case CommentGroup.MEMBER:
        await this.memberService.memberStatsEditor({
          _id: input.commentRefId,
          targetKey: 'memberComments',
          modifier: 1,
        });
        break;
    }

    if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);

    // 🔥 Invalidate cache
    await this.invalidateCache(input.commentRefId);

    return result;
  }

  /**
   * ✅ UPDATE COMMENT
   */
  public async updateComment(
    memberId: ObjectId,
    input: CommentUpdate,
  ): Promise<Comment> {
    const { _id, commentRefId } = input;

    const result = await this.commentModel
      .findOneAndUpdate(
        {
          _id,
          memberId,
          commentStatus: CommentStatus.ACTIVE,
        },
        input,
        { new: true },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    // 🔥 Invalidate cache
    if (commentRefId) {
      await this.invalidateCache(commentRefId);
    }

    return result;
  }

  /**
   * ✅ GET COMMENTS (CACHED)
   */
  public async getComments(
    memberId: ObjectId,
    input: CommentsInquiry,
  ): Promise<Comments> {
    const { commentRefId } = input.search;

    // 🔑 Get version
    const version = await this.getCacheVersion(commentRefId);

    const cacheKey = `comments:${commentRefId}:v${version}:page:${input.page}:limit:${input.limit}`;

    // 1. Try cache
    const cached = await this.cacheManager.get<Comments>(cacheKey);
    if (cached) return cached;

    const match: T = {
      commentRefId,
      commentStatus: CommentStatus.ACTIVE,
    };

    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };

    const result: Comments[] = await this.commentModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupAuthMemberLiked(memberId),
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    // 2. Save to cache
    await this.cacheManager.set(cacheKey, result[0], 60);

    return result[0];
  }

  /**
   * ✅ REMOVE COMMENT (ADMIN)
   */
  public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
    const result = await this.commentModel.findByIdAndDelete(input).exec();

    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

    // 🔥 Invalidate cache
    await this.invalidateCache(result.commentRefId);

    return result;
  }
}
