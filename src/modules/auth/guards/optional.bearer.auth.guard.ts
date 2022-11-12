import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';

@Injectable()
export class OptionalBearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return true;
    request.body.userId = this.authorize(request.headers.authorization);

    return true;
  }
  private authorize(authHeader: string): string {
    if (!authHeader.startsWith('Bearer ')) return undefined;

    const token = authHeader.split(' ')[1];
    const id = TokenPair.unpackAccessToken(token);
    if (!id) return undefined;

    return id;
  }
}
