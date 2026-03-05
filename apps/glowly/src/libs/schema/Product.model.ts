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

/* ================= VARIANT SCHEMA  ================= */

const VariantSchema = new Schema(
  {
    name: { type: String, required: true },
    hexCode: { type: String },
    images: [{ type: String }],

    price: { type: Number },
    sku: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

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
    variants: {
      type: [VariantSchema],
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

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'products' },
);

ProductSchema.index({ memberId: 1, productStatus: 1, createdAt: -1 });

export default ProductSchema;
