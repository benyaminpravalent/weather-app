import {
  ArgumentsHost,
  Catch,
  ContextType,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { BaseApiException } from '../exceptions/base-api.exception';
import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** Set logger context */
  constructor(
    private config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: T, host: ArgumentsHost): any {
    const isGraphQL = host.getType() === ('graphql' as ContextType);

    // Handle GraphQL or REST requests
    const ctx = isGraphQL
      ? GqlExecutionContext.create(host as ExecutionContext).getContext()
      : host.switchToHttp();

    const req = isGraphQL ? ctx.req : ctx.getRequest();
    const res = isGraphQL ? ctx.res : ctx.getResponse();

    // Ensure the response has not already been sent
    if (res.headersSent) {
      console.log('Headers already sent. Skipping error response.');
      return;
    }

    const path =
      req.url || (isGraphQL ? ctx.req.body.operationName : undefined);
    const timestamp = new Date().toISOString();
    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    const requestContext = createRequestContext(req);

    let stack: any;
    let statusCode: HttpStatus | undefined = undefined;
    let errorName: string | undefined = undefined;
    let message: string | undefined = undefined;
    let details: string | Record<string, any> | undefined = undefined;

    // TODO: Based on language value in header, return a localized message.
    const acceptedLanguage = req.headers['accept-language'] || 'en';
    let localizedMessage: string | undefined = undefined;

    // Process different exception types
    if (exception instanceof BaseApiException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      localizedMessage = exception.localizedMessage
        ? exception.localizedMessage[acceptedLanguage]
        : undefined;
      details = exception.details || exception.getResponse();
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      details = exception.getResponse();
    } else if (exception instanceof Error) {
      errorName = exception.constructor.name;
      message = exception.message;
      stack = exception.stack;
    }

    // Set default internal server error if no match
    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    errorName = errorName || 'InternalException';
    message = message || 'Internal server error';

    // Construct the error response
    const error = {
      statusCode,
      message,
      localizedMessage,
      errorName,
      details,
      // Additional meta
      path,
      requestId,
      timestamp,
    };

    this.logger.warn(requestContext, error.message, {
      error,
      stack,
    });

    // Suppress original error details in production mode
    const isProdMode = this.config.get<string>('env') !== 'development';
    if (isProdMode && statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.message = 'Internal server error';
    }

    // Handle GraphQL errors by returning the error object
    if (isGraphQL) {
      return error; // GraphQL will handle this as part of its response
    }

    // Handle REST errors by sending the response
    res.status(statusCode).json({ error });
  }
}
