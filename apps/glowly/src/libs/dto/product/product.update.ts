import { Field, InputType, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';

import type { ObjectId } from 'mongoose';

import {
  ProductType,
  ProductStatus,
  VolumeUnit,
  SkinType,
  ProductTarget,
  DiscountType,
  IngredientType,
  AgeRange,
} from '../../enums/product.enum';

@InputType()
export class ProductUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsEnum(ProductType)
  @Field(() => ProductType, { nullable: true })
  productType?: ProductType;

  @IsOptional()
  @IsEnum(ProductStatus)
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  productTitle?: string;

  @IsOptional()
  @Min(0)
  @Field(() => Float, { nullable: true })
  productPrice?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @Field(() => DiscountType, { nullable: true })
  discountType?: DiscountType;

  @IsOptional()
  @Min(0)
  @Field(() => Float, { nullable: true })
  discountValue?: number;

  @IsOptional()
  @Min(0)
  @Field(() => Float, { nullable: true })
  volume?: number;

  @IsOptional()
  @IsEnum(VolumeUnit)
  @Field(() => VolumeUnit, { nullable: true })
  volumeUnit?: VolumeUnit;

  @IsOptional()
  @IsArray()
  @IsEnum(SkinType, { each: true })
  @Field(() => [SkinType], { nullable: true })
  skinType?: SkinType[];

  @IsOptional()
  @IsEnum(ProductTarget)
  @Field(() => ProductTarget, { nullable: true })
  productTarget?: ProductTarget;

  @IsOptional()
  @IsArray()
  @IsEnum(AgeRange, { each: true })
  @Field(() => [AgeRange], { nullable: true })
  ageRange?: AgeRange[];

  @IsOptional()
  @IsArray()
  @IsEnum(IngredientType, { each: true })
  @Field(() => [IngredientType], { nullable: true })
  ingredientType?: IngredientType[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  stock?: number;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @IsOptional()
  @Length(5, 1000)
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  manufacturedAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  expiresAt?: Date;

  deletedAt?: Date;
  soldAt?: Date;
}
