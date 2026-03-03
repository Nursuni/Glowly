import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryMethod,
} from '../../enums/order.enum';
import { Product } from '../product/product';

// ─────────────────────────────────────────────
//  ORDER ITEM
// ─────────────────────────────────────────────
@ObjectType()
export class OrderItem {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  productId: ObjectId;

  @Field(() => Int)
  itemQty: number;

  @Field(() => Float)
  itemPrice: number;

  @Field(() => String, { nullable: true })
  itemShade?: string;

  /** from aggregation **/
  @Field(() => Product, { nullable: true })
  productData?: Product;
}

// ─────────────────────────────────────────────
//  ORDER
// ─────────────────────────────────────────────
@ObjectType()
export class Order {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => OrderStatus)
  orderStatus: OrderStatus;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(() => DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  // delivery info
  @Field(() => String)
  recipientName: string;

  @Field(() => String)
  recipientPhone: string;

  @Field(() => String)
  deliveryAddress: string;

  @Field(() => String)
  deliveryCity: string;

  @Field(() => String, { nullable: true })
  deliveryZip?: string;

  // items
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  // pricing
  @Field(() => Float)
  itemsTotal: number;

  @Field(() => Float)
  deliveryFee: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  orderTotal: number;

  // coupon
  @Field(() => String, { nullable: true })
  couponCode?: string;

  @Field(() => String, { nullable: true })
  orderNote?: string;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;

  @Field(() => Date, { nullable: true })
  cancelledAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /** from aggregation **/
  @Field(() => Member, { nullable: true })
  memberData?: Member;
}

// ─────────────────────────────────────────────
//  PAGINATED RESPONSE
// ─────────────────────────────────────────────
@ObjectType()
export class Orders {
  @Field(() => [Order])
  list: Order[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}
