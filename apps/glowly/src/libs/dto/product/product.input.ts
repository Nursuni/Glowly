import { Field, InputType, Int, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  IsEnum,
  IsArray,
  IsIn,
  ArrayMinSize,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import {
  ProductType,
  ProductTarget,
  SkinType,
  DiscountType,
  VolumeUnit,
  IngredientType,
  AgeRange,
  ProductStatus,
} from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';
import { availableProductSorts } from '../../config';

@InputType()
export class ProductInput {
  @IsEnum(ProductType)
  @IsNotEmpty()
  @Field(() => ProductType)
  productType: ProductType;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  productTitle: string;

  memberId?: ObjectId;
  @IsNotEmpty()
  @Min(0)
  @Field(() => Float)
  productPrice: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @Field(() => DiscountType, { nullable: true })
  discountType?: DiscountType;

  @IsOptional()
  @Min(0)
  @Field(() => Float, { nullable: true })
  discountValue?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
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
  @Min(0)
  @Field(() => Int, { nullable: true })
  stock?: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Field(() => [String])
  productImages: string[];

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
}

@InputType()
export class PricesRange {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;
}

@InputType()
export class ProductSearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;
  @IsOptional()
  @IsArray()
  @IsEnum(ProductType, { each: true })
  @Field(() => [ProductType], { nullable: true })
  productTypeList?: ProductType[];

  @IsOptional()
  @IsEnum(ProductTarget)
  @Field(() => ProductTarget, { nullable: true })
  productTarget?: ProductTarget;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productDesc?: string;
  @IsOptional()
  @IsArray()
  @IsEnum(SkinType, { each: true })
  @Field(() => [SkinType], { nullable: true })
  skinType?: SkinType[];
  @IsOptional()
  @Field(() => PricesRange, { nullable: true })
  pricesRange?: PricesRange;
  @IsOptional()
  @IsArray()
  @IsEnum(AgeRange, { each: true })
  @Field(() => [AgeRange], { nullable: true })
  ageRange?: AgeRange[];
}

@InputType()
export class ProductsInquiry {
  @Min(1)
  @Field(() => Int)
  page: number;

  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  direction?: Direction;

  @Field(() => ProductSearch)
  search: ProductSearch;
}

@InputType()
export class OrdinaryInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;
}
@InputType()
class SPISearch {
  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;
}

@InputType()
export class SellerProductsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => SPISearch)
  search: SPISearch;
}

@InputType()
class ALPISearch {
  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @IsOptional()
  @Field(() => [ProductType], { nullable: true })
  productTypeList?: ProductType[];
}

@InputType()
export class AllProductsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => ALPISearch)
  search: ALPISearch;
}
