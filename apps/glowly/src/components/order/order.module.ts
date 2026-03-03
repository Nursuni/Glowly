import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

import { AuthModule } from '../auth/auth.module';
import OrderSchema from '../../libs/schema/Order.model';
import ProductSchema from '../../libs/schema/Product.model';
import MemberSchema from '../../libs/schema/Member.model';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Member', schema: MemberSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
