import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { T } from './libs/types/common';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { ComponentsModule } from './components/components.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SocketModule } from './socket/socket.module';
import { CacheModule } from '@nestjs/cache-manager';

import Redis from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      csrfPrevention: false,
      autoSchemaFile: true,
      formatError: (error: T) => {
        console.log('error:', error);
        const graphQLFormatError = {
          code: error?.extensions?.code || 'INTERNAL_SERVER_ERROR',
          message:
            error?.extensions?.response?.message ||
            error?.message ||
            'Something went wrong',
        };
        console.log('GRAPHQL GLOBAL ERR');
        return graphQLFormatError;
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisClient = new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        });

        redisClient.on('connect', () => console.log('✅ Redis connected!'));
        redisClient.on('error', (err) =>
          console.log('❌ Redis error:', err.message),
        );

        return {
          store: {
            create: () => ({
              get: (key: string) => redisClient.get(key),
              set: (key: string, value: any, ttl?: number) =>
                redisClient.set(key, JSON.stringify(value), 'EX', ttl || 60),
              del: (key: string) => redisClient.del(key),
              reset: () => redisClient.flushall(),
            }),
          },
        };
      },
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),

    ComponentsModule,
    DatabaseModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
