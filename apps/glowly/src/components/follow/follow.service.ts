import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Model, ObjectId } from 'mongoose';
import {
  Follower,
  Followers,
  Following,
  Followings,
} from '../../libs/dto/follow/follow';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';
import { T } from '../../libs/types/common';
import {
  lookupAuthMemberFollowed,
  lookupAuthMemberLiked,
  lookupFollowerData,
  lookupFollowingData,
} from '../../libs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class FollowService {
  private readonly logger = new Logger(FollowService.name);

  constructor(
    @InjectModel('Follow')
    private readonly followModel: Model<Follower | Following>,
    private memberService: MemberService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async subscribe(
    followerId: ObjectId,
    followingId: ObjectId,
  ): Promise<Follower> {
    if (followerId.toString() === followingId.toString()) {
      throw new BadRequestException(Message.SELF_SUBSCRIPTION_DENIED);
    }

    const targetMember = await this.memberService.getMember(null, followingId);
    if (!targetMember) throw new NotFoundException(Message.NO_DATA_FOUND);

    const result = await this.registerSubscription(followerId, followingId);

    if (result) {
      // 1. Update Stats in MongoDB
      await this.memberService.memberStatsEditor({
        _id: followerId,
        targetKey: 'memberFollowings',
        modifier: 1,
      });
      await this.memberService.memberStatsEditor({
        _id: followingId,
        targetKey: 'memberFollowers',
        modifier: 1,
      });

      // 2. INVALIDATE CACHE in Redis
      // This ensures that next time someone views these profiles, they see the new counts.
      await this.cacheManager.del(`member:${followerId.toString()}`);
      await this.cacheManager.del(`member:${followingId.toString()}`);
    }

    return result;
  }

  private async registerSubscription(
    followerId: ObjectId,
    followingId: ObjectId,
  ): Promise<Follower> {
    try {
      return await this.followModel.create({
        followingId: followingId,
        followerId: followerId,
      });
    } catch (err: unknown) {
      this.logger.error('Failed to create follow relation', err);

      if (this.isDuplicateKeyError(err)) {
        throw new ConflictException('Already subscribed');
      }

      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async unsubscribe(
    followerId: ObjectId,
    followingId: ObjectId,
  ): Promise<Follower> {
    const targetMember = await this.memberService.getMember(null, followingId);
    if (!targetMember) throw new NotFoundException(Message.NO_DATA_FOUND);

    const result = await this.followModel
      .findOneAndDelete({
        followingId: followingId,
        followerId: followerId,
      })
      .exec();

    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    if (result) {
      // 1. Update Stats in MongoDB
      await this.memberService.memberStatsEditor({
        _id: followerId,
        targetKey: 'memberFollowings',
        modifier: -1,
      });
      await this.memberService.memberStatsEditor({
        _id: followingId,
        targetKey: 'memberFollowers',
        modifier: -1,
      });

      // 2. INVALIDATE CACHE
      await this.cacheManager.del(`member:${followerId.toString()}`);
      await this.cacheManager.del(`member:${followingId.toString()}`);
    }
    return result;
  }

  public async getMemberFollowings(
    memberId: ObjectId,
    input: FollowInquiry,
  ): Promise<Followings> {
    const { page, limit, search } = input; //destruct
    if (!search?.followerId) throw new BadRequestException(Message.BAD_REQUEST);
    const match: T = { followerId: search?.followerId };

    const result = await this.followModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: Direction.DESC } },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupAuthMemberLiked(memberId, '$followingId'),
              lookupAuthMemberFollowed({
                followerId: memberId,
                followingId: '$followingId',
              }),
              lookupFollowingData,
              { $unwind: '$followingData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result?.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  public async getMemberFollowers(
    memberId: ObjectId,
    input: FollowInquiry,
  ): Promise<Followers> {
    const { page, limit, search } = input;
    if (!search?.followingId)
      throw new BadRequestException(Message.BAD_REQUEST);

    const match: T = { followingId: search?.followingId };

    const result = await this.followModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: Direction.DESC } },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupAuthMemberLiked(memberId, '$followerId'),
              lookupAuthMemberFollowed({
                followerId: memberId,
                followingId: '$followerId',
              }),
              lookupFollowerData,
              { $unwind: '$followerData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result?.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  private isDuplicateKeyError(err: unknown): boolean {
    if (!err || typeof err !== 'object') return false;
    const maybeMongoError = err as { code?: number };
    return maybeMongoError.code === 11000;
  }
}
