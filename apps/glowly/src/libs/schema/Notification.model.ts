import { Schema } from 'mongoose';
import {
  NotificationGroup,
  NotificationStatus,
  NotificationType,
} from '../enums/notification.enum';

const NotificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      enum: NotificationType,
      required: true,
    },

    notificationStatus: {
      type: String,
      enum: NotificationStatus,
      default: NotificationStatus.UNREAD,
    },

    notificationGroup: {
      type: String,
      enum: NotificationGroup,
      required: true,
    },

    notificationTitle: {
      type: String,
      required: true,
    },

    notificationDesc: {
      type: String,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    // optional deep-link refs
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },

    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'BoardArticle',
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  { timestamps: true, collection: 'notifications' },
);

// fetch my notifications fast
NotificationSchema.index({
  receiverId: 1,
  notificationStatus: 1,
  createdAt: -1,
});

export default NotificationSchema;
