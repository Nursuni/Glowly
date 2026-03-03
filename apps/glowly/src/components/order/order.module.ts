import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

import { AuthModule } from '../auth/auth.module';
import OrderSchema from '../../libs/schema/Order.model';
import ProductSchema from '../../libs/schema/Product.model';
import MemberSchema from '../../libs/schema/Member.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Member', schema: MemberSchema },
    ]),
    AuthModule,
  ],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
