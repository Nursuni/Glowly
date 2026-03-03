import { Schema } from 'mongoose';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryMethod,
} from '../enums/order.enum';

// ─────────────────────────────────────────────
//  ORDER ITEM  (embedded in Order)
// ─────────────────────────────────────────────
const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    itemQty: {
      type: Number,
      required: true,
      min: 1,
    },
    itemPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    itemShade: {
      type: String,
    },
  },
  { _id: true },
);

// ─────────────────────────────────────────────
//  ORDER
// ─────────────────────────────────────────────
const OrderSchema = new Schema(
  {
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },

    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.UNPAID,
    },

    deliveryMethod: {
      type: String,
      enum: DeliveryMethod,
      required: true,
    },

    // delivery info
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryCity: { type: String, required: true },
    deliveryZip: { type: String },

    // order items (embedded)
    orderItems: {
      type: [OrderItemSchema],
      required: true,
    },

    // pricing
    itemsTotal: { type: Number, required: true }, // sum before discount
    deliveryFee: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    orderTotal: { type: Number, required: true }, // final amount

    // coupon
    couponCode: { type: String },

    orderNote: { type: String },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },

    paidAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true, collection: 'orders' },
);

OrderSchema.index({ memberId: 1, orderStatus: 1, createdAt: -1 });

export default OrderSchema;
