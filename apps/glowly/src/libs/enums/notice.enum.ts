import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
  FAQ = 'FAQ',
  TERMS = 'TERMS',
  INQUIRY = 'INQUIRY',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  POLICY = 'POLICY',
  PROMOTION = 'PROMOTION',
  SHIPPING = 'SHIPPING',
  PAYMENT = 'PAYMENT',
  ACCOUNT = 'ACCOUNT',
  PRODUCT = 'PRODUCT',
  EVENT = 'EVENT',
  MAINTENANCE = 'MAINTENANCE',
}
registerEnumType(NoticeCategory, {
  name: 'NoticeCategory',
});

export enum NoticeStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',

  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}
registerEnumType(NoticeStatus, {
  name: 'NoticeStatus',
});

export enum NoticePriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

registerEnumType(NoticePriority, {
  name: 'NoticePriority',
});

export enum NoticeTarget {
  ALL = 'ALL',
  MEMBERS = 'MEMBERS',
  BRANDS = 'BRANDS',
  SPECIFIC_TIER = 'SPECIFIC_TIER',
  NEW_MEMBERS = 'NEW_MEMBERS',
}

registerEnumType(NoticeTarget, {
  name: 'NoticeTarget',
});
