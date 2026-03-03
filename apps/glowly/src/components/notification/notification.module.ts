import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

import { AuthModule } from '../auth/auth.module';
import NotificationSchema from '../../libs/schema/Notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    AuthModule,
  ],
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService], // ← exported so other modules can inject it
})
export class NotificationModule {}
