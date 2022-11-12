import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization)
      throw new UnauthorizedException('You should use Bearer auth');
    request.body.userId = this.authorize(request.headers.authorization);

    return true;
  }
  private authorize(authHeader: string): string {
    if (!authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('You should use Bearer auth');

    const token = authHeader.split(' ')[1];
    const id = TokenPair.unpackAccessToken(token);
    if (!id)
      throw new UnauthorizedException('accessToken is invalid or expired');

    return id;
  }
}
