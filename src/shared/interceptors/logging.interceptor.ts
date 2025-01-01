import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isGraphQL = context.getType() === ('graphql' as ContextType);

    // Extract request and response objects based on the context type
    const req = isGraphQL
      ? context.getArgByIndex(2)?.req // GraphQL context
      : context.switchToHttp().getRequest(); // REST context

    const res = isGraphQL
      ? context.getArgByIndex(2)?.res // GraphQL context
      : context.switchToHttp().getResponse(); // REST context

    const method = req?.method || 'GraphQL';
    const url = req?.url || 'GraphQL operation';

    const ctx = createRequestContext(req);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const statusCode = res?.statusCode || 200; // Default to 200 for GraphQL

        const responseTime = Date.now() - now;

        const resData = {
          method,
          url,
          statusCode,
          responseTime,
        };

        this.appLogger.log(ctx, 'Request completed', { resData });
      }),
    );
  }
}
