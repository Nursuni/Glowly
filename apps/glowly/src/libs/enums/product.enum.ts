import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
  SKINCARE = 'SKINCARE',
  MAKEUP = 'MAKEUP',
  HAIRCARE = 'HAIRCARE',
  BODYCARE = 'BODYCARE',
  FRAGRANCE = 'FRAGRANCE',
  TOOLS = 'TOOLS',
  WELLNESS = 'WELLNESS',
  GIFT_CARD = 'GIFT_CARD',
  NAILCARE = 'NAILCARE',
  BABYCARE = 'BABYCARE',
}

registerEnumType(ProductType, {
  name: 'ProductType',
});

export enum SkinType {
  NORMAL = 'NORMAL',
  DRY = 'DRY',
  OILY = 'OILY',
  COMBINATION = 'COMBINATION',
  SENSITIVE = 'SENSITIVE',
}

registerEnumType(SkinType, {
  name: 'SkinType',
});

export enum ProductTarget {
  WOMEN = 'WOMEN',
  MEN = 'MEN',
  KIDS = 'KIDS',
  UNISEX = 'UNISEX',
}

registerEnumType(ProductTarget, {
  name: 'ProductTarget',
});

export enum ProductStatus {
  // HOLD = 'HOLD',
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED', // Product no longer sold
  COMING_SOON = 'COMING_SOON', // Pre-launch products
  DELETED = 'DELETED',
}
registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

export enum BranchLocation {
  SEOUL = 'SEOUL',
  BUSAN = 'BUSAN',
  INCHEON = 'INCHEON',
  DAEGU = 'DAEGU',
  GYEONGJU = 'GYEONGJU',
  GWANGJU = 'GWANGJU',
  JEONJU = 'JEONJU',
  DAEJEON = 'DAEJEON',
  JEJU = 'JEJU',
}
registerEnumType(BranchLocation, {
  name: 'BranchLocation',
});

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

registerEnumType(DiscountType, {
  name: 'DiscountType',
});

export enum VolumeUnit {
  ML = 'ML', // Milliliters
  L = 'L', // Liters
  G = 'G', // Grams
  KG = 'KG', // Kilograms
  OZ = 'OZ', // Ounces
  FL_OZ = 'FL_OZ', // Fluid Ounces
  PCS = 'PCS', // Pieces
}

registerEnumType(VolumeUnit, {
  name: 'VolumeUnit',
});

export enum RatingValue {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

registerEnumType(RatingValue, {
  name: 'RatingValue',
});

export enum IngredientType {
  NATURAL = 'NATURAL',
  ORGANIC = 'ORGANIC',
  VEGAN = 'VEGAN',
  CRUELTY_FREE = 'CRUELTY_FREE',
  PARABEN_FREE = 'PARABEN_FREE',
  SULFATE_FREE = 'SULFATE_FREE',
  FRAGRANCE_FREE = 'FRAGRANCE_FREE',
  HYPOALLERGENIC = 'HYPOALLERGENIC',
  DERMATOLOGIST_TESTED = 'DERMATOLOGIST_TESTED',
  CHEMICAL = 'CHEMICAL',
}

registerEnumType(IngredientType, {
  name: 'IngredientType',
});
