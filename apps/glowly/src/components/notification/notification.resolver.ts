import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { NotificationService } from './notification.service';
import {
  Notification,
  Notifications,
} from '../../libs/dto/notification/notification';
import { NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  // ─────────────────────────────────────────────
  //  getNotifications  — my paginated list
  // ─────────────────────────────────────────────
  @Query(() => Notifications)
  @UseGuards(AuthGuard)
  async getNotifications(
    @Args('input') input: NotificationsInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Notifications> {
    return this.notificationService.getNotifications(memberId, input);
  }

  // ─────────────────────────────────────────────
  //  getUnreadCount  — bell badge number
  // ─────────────────────────────────────────────
  @Query(() => Int)
  @UseGuards(AuthGuard)
  async getUnreadCount(
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<number> {
    return this.notificationService.getUnreadCount(memberId);
  }

  // ─────────────────────────────────────────────
  //  markNotificationRead  — click one notification
  // ─────────────────────────────────────────────
  @Mutation(() => Notification)
  @UseGuards(AuthGuard)
  async markNotificationRead(
    @Args('notificationId') notificationId: string,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Notification> {
    return this.notificationService.markAsRead(memberId, notificationId);
  }

  // ─────────────────────────────────────────────
  //  markAllNotificationsRead  — open panel
  // ─────────────────────────────────────────────
  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async markAllNotificationsRead(
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<boolean> {
    return this.notificationService.markAllAsRead(memberId);
  }

  // ─────────────────────────────────────────────
  //  deleteNotification  — user removes a row
  // ─────────────────────────────────────────────
  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Args('notificationId') notificationId: string,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<boolean> {
    return this.notificationService.deleteNotification(
      memberId,
      notificationId,
    );
  }
}
