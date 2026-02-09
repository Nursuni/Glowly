import { Schema } from 'mongoose';
import {
  BranchLocation,
  ProductStatus,
  ProductSubType,
  ProductType,
  VolumeUnit,
  SkinType,
  ProductTarget,
  DiscountType,
  IngredientType,
} from '../enums/product.enum';

const ProductSchema = new Schema(
  {
    productType: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },

    productSubType: {
      type: String,
      enum: Object.values(ProductSubType),
    },

    productStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
    },

    branchLocation: {
      type: String,
      enum: Object.values(BranchLocation),
      required: true,
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
    },

    productTarget: {
      type: String,
      enum: Object.values(ProductTarget),
    },

    ingredientType: {
      type: [String],
      enum: Object.values(IngredientType),
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

ProductSchema.index({ productType: 1, branchLocation: 1, productTitle: 1 });

export default ProductSchema;
