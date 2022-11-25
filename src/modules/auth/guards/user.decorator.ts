import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import TokenPayload from '../models/jwt/token.payload';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
