import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const type = context.getType<'http' | 'graphql'>();

    if (type === 'http') {
      const req = context.switchToHttp().getRequest();
      const { method, url } = req;

      this.logger.log(`${method} ${url}`, 'REQUEST');

      return next.handle().pipe(
        tap(() => {
          const ms = Date.now() - startTime;
          this.logger.log(`${method} ${url} - ${ms}ms`, 'RESPONSE');
        }),
        catchError((error) => {
          const ms = Date.now() - startTime;
          this.logger.error(`${method} ${url} - ${ms}ms`, error.stack, 'ERROR');
          throw error;
        }),
      );
    }

    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      const req = gqlCtx.getContext().req;

      const operation = info.operation.operation; // query / mutation
      const fieldName = info.fieldName;

      this.logger.log(
        `${operation.toUpperCase()} → ${fieldName}`,
        'GRAPHQL REQUEST',
      );

      return next.handle().pipe(
        tap(() => {
          const ms = Date.now() - startTime;
          this.logger.log(
            `${operation.toUpperCase()} → ${fieldName} - ${ms}ms`,
            'GRAPHQL RESPONSE',
          );
        }),
        catchError((error) => {
          const ms = Date.now() - startTime;

          const message =
            error?.response?.message || error?.message || 'Unknown error';

          this.logger.error(
            `${operation.toUpperCase()} → ${fieldName} - ${ms}ms | ${message}`,
            undefined,
            'GRAPHQL ERROR',
          );

          throw error;
        }),
      );
    }

    return next.handle();
  }
}
