import { Schema } from 'mongoose';
import {
  ProductStatus,
  ProductType,
  VolumeUnit,
  SkinType,
  ProductTarget,
  DiscountType,
  IngredientType,
  AgeRange,
} from '../enums/product.enum';

const ProductSchema = new Schema(
  {
    productType: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    //TODO: correct the SUbt

    productStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
    },

    productTitle: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    discountType: {
      type: String,
      enum: Object.values(DiscountType),
    },

    discountValue: {
      type: Number,
    },

    volume: {
      type: Number,
    },

    volumeUnit: {
      type: String,
      enum: Object.values(VolumeUnit),
    },

    skinType: {
      type: [String],
      enum: Object.values(SkinType),
      default: [],
    },
    productTarget: {
      type: String,
      enum: Object.values(ProductTarget),
    },
    ingredientType: {
      type: [String],
      enum: Object.values(IngredientType),
      default: [],
    },

    ageRange: {
      type: [String],
      enum: Object.values(AgeRange),
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
    },

    productViews: {
      type: Number,
      default: 0,
    },

    productLikes: {
      type: Number,
      default: 0,
    },

    productComments: {
      type: Number,
      default: 0,
    },

    productImages: {
      type: [String],
      required: true,
    },

    productDesc: {
      type: String,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'products' },
);

ProductSchema.index({ productType: 1, productTitle: 1 });
ProductSchema.index({
  productTitle: 'text',
  productDesc: 'text',
});

export default ProductSchema;
