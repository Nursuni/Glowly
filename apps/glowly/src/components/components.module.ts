import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { ProductModule } from './product/product.module';
import { ViewModule } from './view/view.module';
import { AuthModule } from './auth/auth.module';
import { BoardArticleModule } from './board-article/board-article.module';

@Module({
  imports: [
    MemberModule,
    CommentModule,
    FollowModule,
    LikeModule,
    ProductModule,
    ViewModule,
    AuthModule,
    BoardArticleModule,
  ],
})
export class ComponentsModule {}
