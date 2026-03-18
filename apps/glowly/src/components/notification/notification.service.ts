import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  Notification,
  Notifications,
} from '../../libs/dto/notification/notification';
import {
  NotificationsInquiry,
  CreateNotificationInput,
} from '../../libs/dto/notification/notification.input';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}

  // ─────────────────────────────────────────────
  //  CREATE  — called internally by other services
  //  (order, like, follow, comment, etc.)
  // ─────────────────────────────────────────────
  async createNotification(input: CreateNotificationInput): Promise<void> {
    // never notify yourself
    if (String(input.authorId) === String(input.receiverId)) return;

    await this.notificationModel.create({
      ...input,
      notificationStatus: NotificationStatus.UNREAD,
    });
  }

  // ─────────────────────────────────────────────
  //  GET MY NOTIFICATIONS  (paginated)
  // ─────────────────────────────────────────────
  async getNotifications(
    memberId: ObjectId,
    input: NotificationsInquiry,
  ): Promise<Notifications> {
    const { page, limit, search } = input;

    const match: Record<string, any> = { receiverId: memberId };
    if (search?.notificationStatus)
      match.notificationStatus = search.notificationStatus;
    if (search?.notificationGroup)
      match.notificationGroup = search.notificationGroup;

    const [data] = await this.notificationModel
      .aggregate([
        { $match: match },
        {
          $facet: {
            list: [
              { $sort: { createdAt: -1 } },
              { $skip: (page - 1) * limit },
              { $limit: limit },
              // populate author avatar + nick for the notification row
              {
                $lookup: {
                  from: 'members',
                  localField: 'authorId',
                  foreignField: '_id',
                  as: 'authorData',
                },
              },
              {
                $unwind: {
                  path: '$authorData',
                  preserveNullAndEmptyArrays: true,
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
  //  UNREAD COUNT  — bell badge number
  // ─────────────────────────────────────────────
  async getUnreadCount(memberId: ObjectId): Promise<number> {
    return this.notificationModel.countDocuments({
      receiverId: memberId,
      notificationStatus: NotificationStatus.UNREAD,
    });
  }

  // ─────────────────────────────────────────────
  //  MARK ONE AS READ
  // ─────────────────────────────────────────────
  async markAsRead(
    memberId: ObjectId,
    notificationId: string,
  ): Promise<Notification> {
    const updated = await this.notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        receiverId: memberId, // security — can only mark your own
      },
      { $set: { notificationStatus: NotificationStatus.READ } },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Notification not found');
    return updated;
  }

  // ─────────────────────────────────────────────
  //  MARK ALL AS READ  — open notification panel
  // ─────────────────────────────────────────────
  async markAllAsRead(memberId: ObjectId): Promise<boolean> {
    await this.notificationModel.updateMany(
      {
        receiverId: memberId,
        notificationStatus: NotificationStatus.UNREAD,
      },
      { $set: { notificationStatus: NotificationStatus.READ } },
    );
    return true;
  }

  // ─────────────────────────────────────────────
  //  DELETE ONE  — user removes a notification
  // ─────────────────────────────────────────────
  async deleteNotification(
    memberId: ObjectId,
    notificationId: string,
  ): Promise<boolean> {
    const result = await this.notificationModel.deleteOne({
      _id: notificationId,
      receiverId: memberId, // security — can only delete your own
    });

    return result.deletedCount > 0;
  }
}
