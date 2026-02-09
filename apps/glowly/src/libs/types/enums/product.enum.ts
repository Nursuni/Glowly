import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
  SKINCARE = 'SKINCARE',
  MAKEUP = 'MAKEUP',
  HAIRCARE = 'HAIRCARE',
  BODYCARE = 'BODYCARE',
  FRAGRANCE = 'FRAGRANCE',
  TOOLS = 'TOOLS',

  SUNCARE = 'SUNCARE',
  NAILCARE = 'NAILCARE',
  PERSONAL_CARE = 'PERSONAL_CARE',
  BABYCARE = 'BABYCARE',
  DERMA_COSMETICS = 'DERMA_COSMETICS',
}
registerEnumType(ProductType, {
  name: 'ProductType',
});

export enum ProductSubType {
  // SKINCARE
  CLEANSER = 'CLEANSER',
  TONER = 'TONER',
  SERUM = 'SERUM',
  MOISTURIZER = 'MOISTURIZER',
  MASK = 'MASK',

  // MAKEUP
  FOUNDATION = 'FOUNDATION',
  LIPSTICK = 'LIPSTICK',
  MASCARA = 'MASCARA',

  // HAIR
  SHAMPOO = 'SHAMPOO',
  CONDITIONER = 'CONDITIONER',
  HAIR_OIL = 'HAIR_OIL',
}
registerEnumType(ProductSubType, {
  name: 'ProductSubType',
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
  CHONJU = 'CHONJU',
  DAEJON = 'DAEJON',
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
  ML = 'ML',
  G = 'G',
  PCS = 'PCS',
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
  CHEMICAL = 'CHEMICAL',
}

registerEnumType(IngredientType, {
  name: 'IngredientType',
});
