import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
  Min,
} from 'class-validator';
import type { ObjectId } from 'mongoose';
import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
} from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';
import { availableOrderSorts } from '../../config';

// ─────────────────────────────────────────────
//  ORDER ITEM INPUT
// ─────────────────────────────────────────────
@InputType()
export class OrderItemInput {
  @IsNotEmpty()
  @Field(() => String)
  productId: ObjectId;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  itemQty: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  itemShade?: string;
}

// ─────────────────────────────────────────────
//  CREATE ORDER
// ─────────────────────────────────────────────
@InputType()
export class OrderInput {
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsEnum(DeliveryMethod)
  @Field(() => DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  // delivery info
  @IsNotEmpty()
  @Length(2, 80)
  @Field(() => String)
  recipientName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Field(() => String)
  recipientPhone: string;

  @IsNotEmpty()
  @Length(5, 200)
  @Field(() => String)
  deliveryAddress: string;

  @IsNotEmpty()
  @Length(2, 80)
  @Field(() => String)
  deliveryCity: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  deliveryZip?: string;

  // items — at least 1
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];

  // optional coupon
  @IsOptional()
  @Length(3, 30)
  @Field(() => String, { nullable: true })
  couponCode?: string;

  @IsOptional()
  @Length(0, 300)
  @Field(() => String, { nullable: true })
  orderNote?: string;

  // injected server-side — NOT exposed in schema
  memberId?: ObjectId;
}

// ─────────────────────────────────────────────
//  UPDATE ORDER  (customer: cancel only)
//  (admin: full status control via separate input)
// ─────────────────────────────────────────────
@InputType()
export class OrderUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId; // ✅ required, no ?

  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  orderNote?: string;
}

// ─────────────────────────────────────────────
//  MY ORDERS INQUIRY  (customer)
// ─────────────────────────────────────────────
@InputType()
class OISearch {
  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;
}

@InputType()
export class OrdersInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableOrderSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => OISearch)
  search: OISearch;
}

// ─────────────────────────────────────────────
//  ALL ORDERS INQUIRY  (admin)
// ─────────────────────────────────────────────
@InputType()
class AOISearch {
  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class AllOrdersInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableOrderSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => AOISearch)
  search: AOISearch;
}
