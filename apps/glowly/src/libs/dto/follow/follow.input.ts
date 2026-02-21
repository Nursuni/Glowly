import { Field, InputType, Int } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsOptional, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';

@InputType()
class FollowSearch {
  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  followingId?: ObjectId;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  followerId?: ObjectId;
}

@InputType()
export class FollowInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsNotEmpty()
  @Field(() => FollowSearch)
  search: FollowSearch;
}
