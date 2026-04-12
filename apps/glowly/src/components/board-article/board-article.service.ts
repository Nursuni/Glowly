import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { LikeService } from '../like/like.service';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { AuthService } from '../auth/auth.service';
import {
  BoardArticle,
  BoardArticles,
} from '../../libs/dto/board-article/board-article';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AllBoardArticlesInquiry,
  BoardArticleInput,
  BoardArticlesInquiry,
} from '../../libs/dto/board-article/board-article.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import {
  BoardArticlePriority,
  BoardArticleStatus,
} from '../../libs/enums/board-article.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { LikeGroup } from '../../libs/enums/like.enum';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import {
  lookupAuthMemberLiked,
  lookupMember,
  shapeIntoMongoObjectId,
} from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';

@Injectable()
export class BoardArticleService {
  private cacheVersion = 1; // versioning for cache invalidation

  constructor(
    @InjectModel('BoardArticle')
    private readonly boardArticleModel: Model<BoardArticle>,
    private readonly authService: AuthService,
    private readonly viewService: ViewService,
    private readonly memberService: MemberService,
    private readonly likeService: LikeService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject Redis cache
  ) {}

  /** 🔥 Invalidate cache after any mutation */
  private invalidateCache(): void {
    this.cacheVersion++;
  }

  public async createBoardArticle(
    memberId: ObjectId,
    input: BoardArticleInput,
  ): Promise<BoardArticle> {
    input.memberId = memberId;
    try {
      const result = await this.boardArticleModel.create(input);
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberArticles',
        modifier: 1,
      });
      this.invalidateCache(); // clear cache
      return result;
    } catch (err) {
      console.log('Error, Service.model:', (err as Error).message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async getBoardArticle(
    memberId: ObjectId,
    articleId: ObjectId,
  ): Promise<BoardArticle> {
    const search: T = {
      _id: articleId,
      articleStatus: BoardArticleStatus.ACTIVE,
    };
    const targetBoardArticle: BoardArticle = await this.boardArticleModel
      .findOne(search)
      .lean()
      .exec();
    if (!targetBoardArticle)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    // Record views and likes if memberId exists
    if (memberId) {
      const viewInput = {
        memberId,
        viewRefId: articleId,
        viewGroup: ViewGroup.ARTICLE,
      };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.boardArticleStatsEditor({
          _id: articleId,
          targetKey: 'articleViews',
          modifier: 1,
        });
        targetBoardArticle.articleViews++;
      }

      const likeInput = {
        memberId,
        likeRefId: articleId,
        likeGroup: LikeGroup.ARTICLE,
      };
      targetBoardArticle.meLiked =
        await this.likeService.checkLikeExistence(likeInput);
    }

    targetBoardArticle.memberData = await this.memberService.getMember(
      null,
      targetBoardArticle.memberId,
    );

    return targetBoardArticle;
  }

  public async boardArticleStatsEditor(
    input: StatisticModifier,
  ): Promise<BoardArticle> {
    const { _id, targetKey, modifier } = input;
    return await this.boardArticleModel
      .findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        { new: true },
      )
      .exec();
  }

  public async updateBoardArticle(
    memberId: ObjectId,
    input: BoardArticleUpdate,
  ): Promise<BoardArticle> {
    const { _id, articleStatus } = input;
    const result = await this.boardArticleModel
      .findOneAndUpdate(
        { _id, memberId, articleStatus: BoardArticleStatus.ACTIVE },
        { $set: input },
        { new: true },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (articleStatus === BoardArticleStatus.DELETED) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberArticles',
        modifier: -1,
      });
    }

    this.invalidateCache();
    return result;
  }

  public async removeBoardArticle(
    memberId: ObjectId,
    articleId: ObjectId,
  ): Promise<BoardArticle> {
    const result = await this.boardArticleModel
      .findOneAndUpdate(
        { _id: articleId, memberId, articleStatus: BoardArticleStatus.ACTIVE },
        { $set: { articleStatus: BoardArticleStatus.DELETED } },
        { new: true },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

    await this.memberService.memberStatsEditor({
      _id: memberId,
      targetKey: 'memberArticles',
      modifier: -1,
    });

    this.invalidateCache();
    return result;
  }

  /** ✅ Get board articles with Redis cache */
  public async getBoardArticles(
    memberId: ObjectId,
    input: BoardArticlesInquiry,
  ): Promise<BoardArticles> {
    const cacheKey = `boardArticles:v${this.cacheVersion}:${JSON.stringify(
      input,
    )}`;

    const cached = await this.cacheManager.get<BoardArticles>(cacheKey);
    if (cached) {
      console.log('⚡ CACHE HIT');
      return cached;
    }

    const { articleCategory, text } = input.search;
    const match: T = { articleStatus: BoardArticleStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };

    if (articleCategory) match.articleCategory = articleCategory;
    if (text) match.articleTitle = { $regex: new RegExp(text, 'i') };
    if (input.search?.memberId) {
      match.memberId = shapeIntoMongoObjectId(input.search.memberId);
    }

    const result = await this.boardArticleModel
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

    // Save to Redis cache for 60s
    await this.cacheManager.set(cacheKey, result[0]);
    console.log('💾 CACHE SET');

    return result[0];
  }

  /** ✅ Admin Methods */
  public async getAllBoardArticlesByAdmin(
    input: AllBoardArticlesInquiry,
  ): Promise<BoardArticles> {
    const { articleStatus, articleCategory } = input.search;
    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };
    if (articleStatus) match.articleStatus = articleStatus;
    if (articleCategory) match.articleCategory = articleCategory;

    const result = await this.boardArticleModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
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

    return result[0];
  }

  public async updateBoardArticleByAdmin(
    input: BoardArticleUpdate,
  ): Promise<BoardArticle> {
    const { _id, articleStatus } = input;
    const result = await this.boardArticleModel
      .findOneAndUpdate(
        { _id, articleStatus: BoardArticleStatus.ACTIVE },
        input,
        {
          new: true,
        },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (articleStatus === BoardArticleStatus.DELETED) {
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberArticles',
        modifier: -1,
      });
    }

    this.invalidateCache();
    return result;
  }

  public async removeBoardArticleByAdmin(
    articleId: ObjectId,
  ): Promise<BoardArticle> {
    const result = await this.boardArticleModel.findByIdAndUpdate(
      articleId,
      { $set: { articleStatus: BoardArticleStatus.DELETED } },
      { new: true },
    );

    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

    this.invalidateCache();
    return result;
  }

  public async likeTargetBoardArticle(
    memberId: ObjectId,
    likeRefId: ObjectId,
  ): Promise<BoardArticle> {
    const target: BoardArticle = await this.boardArticleModel
      .findOne({ _id: likeRefId, articleStatus: BoardArticleStatus.ACTIVE })
      .exec();

    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId,
      likeRefId,
      likeGroup: LikeGroup.ARTICLE,
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.boardArticleStatsEditor({
      _id: likeRefId,
      targetKey: 'articleLikes',
      modifier,
    });

    if (!result)
      throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;
  }
}
