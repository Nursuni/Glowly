import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardArticleModule } from '../board-article/board-article.module';
import { MemberModule } from '../member/member.module';
import CommentSchema from '../../libs/schema/Comment.model';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    AuthModule,
    ViewModule,
    BoardArticleModule,
    MemberModule,
    ProductModule,
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
