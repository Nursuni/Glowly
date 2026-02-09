import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { T } from './libs/types/common';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      csrfPrevention: false,
      autoSchemaFile: true,
      formatError: (error: T) => {
        console.log('error:', error);
        const graphQLFormatError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.response?.message ||
            error?.extensions?.response?.message ||
            error?.message,
        };
        console.log('GRAPHQL GLOBAL ERR');
        return graphQLFormatError;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
