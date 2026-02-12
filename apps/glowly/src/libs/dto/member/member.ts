import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from '../../enums/member.enum';
import { MeLiked } from '../like/like';
import { MeFollowed } from '../follow/follow';
import { MembershipTier } from '../../enums/member.enum';

@ObjectType()
export class Member {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => MemberType)
  memberType: MemberType;

  @Field(() => MemberStatus)
  memberStatus: MemberStatus;

  @Field(() => MemberAuthType)
  memberAuthType: MemberAuthType;

  @Field(() => String)
  memberPhone: string;

  @Field(() => String)
  memberNick: string;

  memberPassword?: string;

  @Field(() => String, { nullable: true })
  memberFullName?: string;

  @Field(() => String)
  memberImage: string;

  @Field(() => Int, { nullable: true })
  memberProducts: number;

  @Field(() => String, { nullable: true })
  memberAddress?: string;

  @Field(() => String, { nullable: true })
  memberDesc?: string;

  @Field(() => Int)
  memberArticles: number;

  @Field(() => Int)
  memberFollowers: number;

  @Field(() => Int)
  memberFollowings: number;

  @Field(() => Int)
  memberPoints: number;

  @Field(() => Int)
  memberLikes: number;

  @Field(() => Int)
  memberViews: number;

  @Field(() => Int)
  memberComments: number;

  @Field(() => Int)
  memberRank: number;

  @Field(() => Int)
  memberWarnings: number;

  @Field(() => Int)
  memberBlocks: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  /** from aggregation */

  @Field(() => [MeLiked], { nullable: true })
  meLiked?: MeLiked[];

  @Field(() => [MeFollowed], { nullable: true })
  meFollowed?: MeFollowed[];
}

@ObjectType()
export class TotalCounter {
  @Field(() => Int, { nullable: true })
  total: number;
}

@ObjectType()
export class Members {
  @Field(() => [Member])
  list: Member[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class MembershipBenefits {
  @Field(() => Float)
  discountPercentage: number;

  @Field(() => Float)
  pointsMultiplier: number;

  @Field(() => Boolean)
  freeShipping: boolean;

  @Field(() => Boolean)
  earlyAccess: boolean;

  @Field(() => Int)
  birthdayBonus: number;

  @Field(() => Int)
  monthlyFreeSamples: number;
}

@ObjectType()
export class MembershipInfo {
  @Field(() => MembershipTier)
  currentTier: MembershipTier;

  @Field(() => Int)
  currentPoints: number;

  @Field(() => Int)
  lifetimePoints: number;

  @Field(() => MembershipTier, { nullable: true })
  nextTier?: MembershipTier;

  @Field(() => Int, { nullable: true })
  pointsToNextTier?: number;

  @Field(() => MembershipBenefits)
  benefits: MembershipBenefits;

  @Field(() => Int)
  currentStreak: number;
}
