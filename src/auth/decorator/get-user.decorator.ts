import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../strategy/requestWithUser';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
