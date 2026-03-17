import { Schema } from 'mongoose';
import {
  ProductStatus,
  ProductType,
  VolumeUnit,
  SkinType,
  ProductTarget,
  IngredientType,
  AgeRange,
} from '../enums/product.enum';

/* ================= PRODUCT SCHEMA ================= */

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
    soldAt: { type: Date },
    manufacturedAt: { type: Date },
    expiresAt: { type: Date },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'products' },
);

ProductSchema.index({ memberId: 1, productStatus: 1, createdAt: -1 });

export default ProductSchema;
