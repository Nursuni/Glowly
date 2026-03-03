import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order } from '../../libs/dto/order/order';
import { Orders } from '../../libs/dto/order/order';
import { Member } from '../../libs/dto/member/member';
import { Product } from '../../libs/dto/product/product';
import {
  OrderInput,
  OrderUpdate,
  OrdersInquiry,
  AllOrdersInquiry,
} from '../../libs/dto/order/order.input';
import { OrderStatus, PaymentStatus } from '../../libs/enums/order.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { ProductStatus } from '../../libs/enums/product.enum';
import { Direction } from '../../libs/enums/common.enum';

// delivery fee rules
const DELIVERY_FEES: Record<string, number> = {
  STANDARD: 3000,
  EXPRESS:  6000,
  SAME_DAY: 10000,
  PICKUP:   0,
};
const FREE_DELIVERY_THRESHOLD = 50000;

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order')   private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Member')  private readonly memberModel: Model<Member>,
  ) {}

  // ─────────────────────────────────────────────
  //  CREATE ORDER
  // ─────────────────────────────────────────────
  async createOrder(memberId: ObjectId, input: OrderInput): Promise<Order> {
    // 1. validate all products exist, are ACTIVE, and have enough stock
    const productIds = input.orderItems.map((i) => i.productId);
    const products   = await this.productModel.find({
      _id: { $in: productIds },
      productStatus: ProductStatus.ACTIVE,
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are unavailable');
    }

    const productMap = new Map(products.map((p) => [String(p._id), p]));

    // 2. build items with real prices from DB (never trust client price)
    const orderItems = input.orderItems.map((item) => {
      const product = productMap.get(String(item.productId));
      if (product.stock < item.itemQty) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.productTitle}`,
        );
      }
      const unitPrice =
        product.discountValue && product.discountType
          ? product.productPrice - product.discountValue
          : product.productPrice;

      return {
        productId: item.productId,
        itemQty:   item.itemQty,
        itemPrice: unitPrice * item.itemQty,
        itemShade: item.itemShade,
      };
    });

    // 3. calculate totals
    const itemsTotal = orderItems.reduce((sum, i) => sum + i.itemPrice, 0);

    let deliveryFee = DELIVERY_FEES[input.deliveryMethod] ?? 3000;
    if (itemsTotal >= FREE_DELIVERY_THRESHOLD) deliveryFee = 0;

    // 4. apply coupon if provided
    let discountAmount = 0;
    if (input.couponCode) {
      discountAmount = await this.applyCoupon(input.couponCode, itemsTotal);
    }

    const orderTotal = itemsTotal + deliveryFee - discountAmount;

    // 5. create order
    const order = await this.orderModel.create({
      ...input,
      memberId,
      orderItems,
      itemsTotal,
      deliveryFee,
      discountAmount,
      orderTotal,
      orderStatus:   OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
    });

    if (!order) throw new InternalServerErrorException('Order creation failed');

    // 6. decrement stock for each product
    await Promise.all(
      input.orderItems.map((item) =>
        this.productModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.itemQty },
        }),
      ),
    );

    // 7. increment member order counter
    await this.memberModel.findByIdAndUpdate(memberId, {
      $inc: { memberOrders: 1 },
    });

    return order;
  }

  // ─────────────────────────────────────────────
  //  GET SINGLE ORDER
  // ─────────────────────────────────────────────
  async getOrder(memberId: ObjectId, orderId: ObjectId): Promise<Order> {
    const result = await this.orderModel
      .aggregate([
        {
          $match: {
            _id:      orderId,
            memberId: memberId,   // customer can only see their own
          },
        },
        // populate member
        {
          $lookup: {
            from:         'members',
            localField:   'memberId',
            foreignField: '_id',
            as:           'memberData',
          },
        },
        { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
        // populate products inside orderItems
        {
          $lookup: {
            from:         'products',
            localField:   'orderItems.productId',
            foreignField: '_id',
            as:           'productsData',
          },
        },
      ])
      .exec();

    if (!result.length) throw new NotFoundException('Order not found');
    return result[0];
  }

  // ─────────────────────────────────────────────
  //  MY ORDERS  (customer paginated list)
  // ─────────────────────────────────────────────
  async getOrders(memberId: ObjectId, input: OrdersInquiry): Promise<Orders> {
    const { page, limit, sort, direction, search } = input;
    const match: Record<string, any> = { memberId };

    if (search.orderStatus) match.orderStatus = search.orderStatus;

    const sortDir = direction === Direction.ASC ? 1 : -1;
    const sortKey = sort ?? 'createdAt';

    const [data] = await this.orderModel
      .aggregate([
        { $match: match },
        {
          $facet: {
            list: [
              { $sort:  { [sortKey]: sortDir } },
              { $skip:  (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from:         'products',
                  localField:   'orderItems.productId',
                  foreignField: '_id',
                  as:           'productsData',
                },
              },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    return data;
  }

  // ─────────────────────────────────────────────
  //  UPDATE ORDER  (customer: cancel only)
  // ─────────────────────────────────────────────
  async updateOrder(memberId: ObjectId, input: OrderUpdate): Promise<Order> {
    const { _id, orderStatus, orderNote } = input;

    const order = await this.orderModel.findOne({ _id, memberId });
    if (!order) throw new NotFoundException('Order not found');

    // customer may only cancel a PENDING order
    if (
      orderStatus === OrderStatus.CANCELLED &&
      order.orderStatus !== OrderStatus.PENDING
    ) {
      throw new BadRequestException(
        'Only PENDING orders can be cancelled',
      );
    }

    // restore stock on cancel
    if (orderStatus === OrderStatus.CANCELLED) {
      await Promise.all(
        order.orderItems.map((item: any) =>
          this.productModel.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.itemQty },
          }),
        ),
      );
      await this.memberModel.findByIdAndUpdate(memberId, {
        $inc: { memberOrders: -1 },
      });
    }

    const updated = await this.orderModel.findByIdAndUpdate(
      _id,
      { $set: { orderStatus, orderNote, cancelledAt: orderStatus === OrderStatus.CANCELLED ? new Date() : undefined } },
      { new: true },
    );

    return updated;
  }

  // ─────────────────────────────────────────────
  //  ALL ORDERS  (admin)
  // ─────────────────────────────────────────────
  async getAllOrders(
    admin: Member,
    input: AllOrdersInquiry,
  ): Promise<Orders> {
    if (admin.memberType !== MemberType.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const { page, limit, sort, direction, search } = input;
    const match: Record<string, any> = {};

    if (search.orderStatus) match.orderStatus = search.orderStatus;
    if (search.memberId)    match.memberId    = search.memberId;

    const sortDir = direction === Direction.ASC ? 1 : -1;
    const sortKey = sort ?? 'createdAt';

    const [data] = await this.orderModel
      .aggregate([
        { $match: match },
        {
          $facet: {
            list: [
              { $sort:  { [sortKey]: sortDir } },
              { $skip:  (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from:         'members',
                  localField:   'memberId',
                  foreignField: '_id',
                  as:           'memberData',
                },
              },
              { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    return data;
  }

  // ─────────────────────────────────────────────
  //  PRIVATE — coupon logic (stub, wire to your coupon collection)
  // ─────────────────────────────────────────────
  private async applyCoupon(
    code: string,
    itemsTotal: number,
  ): Promise<number> {
    // TODO: query your coupons collection here
    // return the discount amount (not percentage)
    // throw BadRequestException if invalid / expired
    return 0;
  }
}