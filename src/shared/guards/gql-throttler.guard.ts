import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'http') {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      return { req, res };
    }

    if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const { req, res } = gqlContext.getContext();
      return { req, res };
    }

    throw new Error('Unknown context type');
  }
}
