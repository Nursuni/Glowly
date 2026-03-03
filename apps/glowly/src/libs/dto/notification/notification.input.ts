import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus } from '../../enums/notification.enum';

// ─────────────────────────────────────────────
//  GET NOTIFICATIONS  (my list)
// ─────────────────────────────────────────────
@InputType()
class NISearch {
  @IsOptional()
  @IsEnum(NotificationStatus)
  @Field(() => NotificationStatus, { nullable: true })
  notificationStatus?: NotificationStatus;

  @IsOptional()
  @IsEnum(NotificationGroup)
  @Field(() => NotificationGroup, { nullable: true })
  notificationGroup?: NotificationGroup;
}

@InputType()
export class NotificationsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsNotEmpty()
  @Field(() => NISearch)
  search: NISearch;
}

// ─────────────────────────────────────────────
//  INTERNAL — used by other services to create
//  a notification (not exposed in GraphQL schema)
// ─────────────────────────────────────────────
export interface CreateNotificationInput {
  notificationType:  import('../../enums/notification.enum').NotificationType;
  notificationGroup: NotificationGroup;
  notificationTitle: string;
  notificationDesc?: string;
  authorId:          ObjectId;
  receiverId:        ObjectId;
  productId?:        ObjectId;
  articleId?:        ObjectId;
  orderId?:          ObjectId;
}
