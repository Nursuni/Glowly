import { Inject, Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_PROD
            : process.env.MONGO_DEV,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    if (connection.readyState === 1) {
      console.log('connection.readyState', connection.readyState);
      console.log(
        `✅ MongoDB is connected into ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} db`,
      );
    } else {
      console.log('❌ MongoDB: Connection Failed');
    }
  }

  async onModuleInit() {
    // Redis Check
    try {
      await this.cacheManager.set('connection_test', 'ok', 10);
      const test = await this.cacheManager.get('connection_test');
      if (test === 'ok') {
        console.log('✅ Redis: Connected to Upstash');
      }
    } catch (err) {
      console.log('❌ Redis: Connection Failed', err.message);
    }
  }
}
