import { Module } from '@nestjs/common';
import { BoardArticleResolver } from './board-article.resolver';
import { BoardArticleService } from './board-article.service';
import { LikeModule } from '../like/like.module';
import { ProductModule } from '../product/product.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import BoardArticleSchema from '../../libs/schema/BoardArticle.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BoardArticle', schema: BoardArticleSchema },
    ]),
    AuthModule,
    MemberModule,
    ViewModule,
    ProductModule,
    LikeModule,
  ],
  providers: [BoardArticleResolver, BoardArticleService],
  exports: [BoardArticleService],
})
export class BoardArticleModule {}
