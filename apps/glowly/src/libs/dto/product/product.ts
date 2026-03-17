import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';

import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

import {
  ProductType,
  ProductStatus,
  VolumeUnit,
  SkinType,
  ProductTarget,
  IngredientType,
  AgeRange,
} from '../../enums/product.enum';

@ObjectType()
export class Product {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => ProductStatus)
  productStatus: ProductStatus;

  @Field(() => String)
  productTitle: string;

  @Field(() => [AgeRange], { nullable: true })
  ageRange?: AgeRange[];

  @Field(() => Float)
  productPrice: number;

  @Field(() => Float, { nullable: true })
  volume?: number;

  @Field(() => VolumeUnit, { nullable: true })
  volumeUnit?: VolumeUnit;

  @Field(() => [SkinType], { nullable: true })
  skinType?: SkinType[];

  @Field(() => ProductTarget, { nullable: true })
  productTarget?: ProductTarget;

  @Field(() => [IngredientType], { nullable: true })
  ingredientType?: IngredientType[];

  @Field(() => Int)
  productViews: number;

  @Field(() => Int)
  productLikes: number;

  @Field(() => Int)
  productComments: number;

  @Field(() => [String])
  productImages: string[];

  @Field(() => String, { nullable: true })
  productDesc?: string;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  manufacturedAt?: Date;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date;

  // Add these to Product ObjectType

  @Field(() => Date, { nullable: true })
  soldAt?: Date;

  /** from aggregation **/

  @Field(() => Member, { nullable: true })
  memberData?: Member;

  @Field(() => [MeLiked], { nullable: true })
  meLiked?: MeLiked[];
}

@ObjectType()
export class Products {
  @Field(() => [Product])
  list: Product[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter?: TotalCounter[];
}
