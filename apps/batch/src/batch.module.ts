import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import ProductSchema from 'apps/glowly/src/libs/schema/Product.model';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from 'apps/glowly/src/libs/schema/Member.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
