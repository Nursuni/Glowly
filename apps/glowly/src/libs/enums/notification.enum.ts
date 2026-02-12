import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
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
