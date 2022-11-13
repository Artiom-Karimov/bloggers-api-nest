import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';
import TokenPayload from '../models/jwt/token.payload';

@Injectable()
export class OptionalBearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return true;
    request.body.tokenPayload = this.authorize(request.headers.authorization);

    return true;
  }
  private authorize(authHeader: string): TokenPayload {
    if (!authHeader.startsWith('Bearer ')) return undefined;

    const token = authHeader.split(' ')[1];
    const payload = TokenPair.unpackToken(token);
    if (!payload) return undefined;

    return payload;
  }
}
