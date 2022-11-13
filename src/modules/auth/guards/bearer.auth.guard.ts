import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';
import TokenPayload from '../models/jwt/token.payload';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization)
      throw new UnauthorizedException('You should use Bearer auth');
    req.body.tokenPayload = this.authorize(req.headers.authorization);

    return true;
  }
  private authorize(authHeader: string): TokenPayload {
    if (!authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('You should use Bearer auth');

    const token = authHeader.split(' ')[1];
    const payload = TokenPair.unpackToken(token);
    if (!payload)
      throw new UnauthorizedException('accessToken is invalid or expired');

    return payload;
  }
}
