import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  ORDER = 'ORDER', // order placed / status changed
  DELIVERY = 'DELIVERY', // shipped / delivered
  REVIEW = 'REVIEW', // someone reviewed your product
  SYSTEM = 'SYSTEM', // admin broadcast
  COUPON = 'COUPON', // new coupon issued
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}
registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
});

export enum NotificationGroup {
  MEMBER = 'MEMBER',
  ARTICLE = 'ARTICLE',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  COMMENT = 'COMMENT',
  SYSTEM = 'SYSTEM',
}
registerEnumType(NotificationGroup, {
  name: 'NotificationGroup',
});

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

registerEnumType(NotificationPriority, {
  name: 'NotificationPriority',
});
