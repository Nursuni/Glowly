import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({ origin: true, credentials: true });
  app.use(
    graphqlUploadExpress({ maxFileSize: 20 * 1024 * 1024, maxFiles: 10 }),
  );
  app.use('/uploads', express.static('./uploads'));
  app.use(helmet()); //protects against common HTTP vulnerabilities.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
