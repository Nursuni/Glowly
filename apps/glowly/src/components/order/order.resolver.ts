import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { OrderService } from './order.service';
import { Order, Orders } from '../../libs/dto/order/order';
import {
  OrderInput,
  OrderUpdate,
  OrdersInquiry,
  AllOrdersInquiry,
} from '../../libs/dto/order/order.input';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Member } from '../../libs/dto/member/member';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // ─────────────────────────────────────────────
  //  createOrder  — authenticated customer
  // ─────────────────────────────────────────────
  @Mutation(() => Order)
  @UseGuards(AuthGuard)
  async createOrder(
    @Args('input') input: OrderInput,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Order> {
    input.memberId = memberId;
    return this.orderService.createOrder(memberId, input);
  }

  // ─────────────────────────────────────────────
  //  getOrder  — owner only
  // ─────────────────────────────────────────────
  @Query(() => Order)
  @UseGuards(AuthGuard)
  async getOrder(
    @Args('orderId') orderId: string,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Order> {
    return this.orderService.getOrder(
      memberId,
      orderId as unknown as mongoose.ObjectId,
    );
  }

  // ─────────────────────────────────────────────
  //  getOrders  — my paginated order list
  // ─────────────────────────────────────────────
  @Query(() => Orders)
  @UseGuards(AuthGuard)
  async getOrders(
    @Args('input') input: OrdersInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Orders> {
    return this.orderService.getOrders(memberId, input);
  }

  @Query(() => [Order])
  @UseGuards(AuthGuard)
  async getMyOrders(
    @Args('input') input: OrdersInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Order[]> {
    const result = await this.orderService.getOrders(memberId, input);
    return result?.list ?? [];
  }
  // ─────────────────────────────────────────────
  //  updateOrder  — customer cancel / note update
  // ─────────────────────────────────────────────
  @Mutation(() => Order)
  @UseGuards(AuthGuard)
  async updateOrder(
    @Args('input') input: OrderUpdate,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Order> {
    return this.orderService.updateOrder(memberId, input);
  }

  // ─────────────────────────────────────────────
  //  getAllOrders  — admin only
  // ─────────────────────────────────────────────
  @Query(() => Orders)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(MemberType.ADMIN)
  async getAllOrders(
    @Args('input') input: AllOrdersInquiry,
    @AuthMember() admin: Member,
  ): Promise<Orders> {
    return this.orderService.getAllOrders(admin, input);
  }
}
