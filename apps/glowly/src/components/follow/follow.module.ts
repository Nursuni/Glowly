import { forwardRef, Module } from '@nestjs/common';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import FollowSchema from '../../libs/schema/Follow.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Follow',
        schema: FollowSchema,
      },
    ]),
    AuthModule,
    forwardRef(() => MemberModule),
  ],
  providers: [FollowResolver, FollowService],
  exports: [FollowService],
})
export class FollowModule {}
