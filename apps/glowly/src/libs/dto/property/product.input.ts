import { Field, InputType, Int, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import {
  BranchLocation,
  ProductType,
  ProductTarget,
  SkinType,
  DiscountType,
  VolumeUnit,
  IngredientType,
} from '../../enums/product.enum';

@InputType()
export class ProductInput {
  @IsEnum(ProductType)
  @IsNotEmpty()
  @Field(() => ProductType)
  productType: ProductType;

  @IsEnum(BranchLocation)
  @IsNotEmpty()
  @Field(() => BranchLocation)
  branchLocation: BranchLocation;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  productTitle: string;

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
  @Field(() => [SkinType], { nullable: true })
  skinType?: SkinType[];

  @IsOptional()
  @IsEnum(ProductTarget)
  @Field(() => ProductTarget, { nullable: true })
  productTarget?: ProductTarget;

  @IsOptional()
  @IsArray()
  @Field(() => [IngredientType], { nullable: true })
  ingredientType?: IngredientType[];

  @IsOptional()
  @Min(0)
  @Field(() => Int, { nullable: true })
  stock?: number;

  @IsNotEmpty()
  @IsArray()
  @Field(() => [String])
  productImages: string[];

  @IsOptional()
  @Length(5, 1000)
  @Field(() => String, { nullable: true })
  productDesc?: string;

  memberId?: ObjectId;
}

@InputType()
export class ProductSearch {
  @IsOptional()
  @IsArray()
  @IsEnum(ProductType, { each: true })
  @Field(() => [ProductType], { nullable: true })
  productTypeList?: ProductType[];

  @IsOptional()
  @IsArray()
  @IsEnum(BranchLocation, { each: true })
  @Field(() => [BranchLocation], { nullable: true })
  branchLocationList?: BranchLocation[];

  @IsOptional()
  @IsEnum(ProductTarget)
  @Field(() => ProductTarget, { nullable: true })
  productTarget?: ProductTarget;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class ProductsInquiry {
  @Min(1)
  @Field(() => Int)
  page: number;

  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  direction?: number;

  @Field(() => ProductSearch)
  search: ProductSearch;
}
