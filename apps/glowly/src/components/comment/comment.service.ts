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

  public async createComment(
    memberId: ObjectId,
    input: CommentInput,
  ): Promise<Comment> {
    input.memberId = memberId;

    let result = null;
    try {
      result = await this.commentModel.create(input);
    } catch (err) {
      console.log('Error, Service.model:', (err as Error).message);
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
    return result;

    // Note: modifier likely follows the pattern above
  }

  public async updateComment(
    memberId: ObjectId,
    input: CommentUpdate,
  ): Promise<Comment> {
    const { _id } = input;
    const result = await this.commentModel
      .findOneAndUpdate(
        {
          _id: _id,
          memberId: memberId,
          commentStatus: CommentStatus.ACTIVE,
        },
        input,
        {
          new: true,
        },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }

  public async getComments(
    memberId: ObjectId,
    input: CommentsInquiry,
  ): Promise<Comments> {
    const cacheKey = `comments:${input.search.commentRefId}:page:${input.page}:limit:${input.limit}`;

    // 1. Try cache
    const cached = await this.cacheManager.get<Comments>(cacheKey);
    if (cached) {
      return cached;
    }

    const { commentRefId } = input.search;

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
    await this.cacheManager.set(cacheKey, result[0], 60); // TTL 60s

    return result[0];
  }

  public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
    const result = await this.commentModel.findByIdAndDelete(input).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
  }
}
