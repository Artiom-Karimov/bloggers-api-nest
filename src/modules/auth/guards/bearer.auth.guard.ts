import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';
import TokenPayload from '../models/jwt/token.payload';
import UsersBanQueryRepository from '../users.ban.query.repository';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private readonly banRepo: UsersBanQueryRepository) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization)
      throw new UnauthorizedException('You should use Bearer auth');
    req.user = await this.authorize(req.headers.authorization);

    return true;
  }
  private async authorize(authHeader: string): Promise<TokenPayload> {
    if (!authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('You should use Bearer auth');

    const token = authHeader.split(' ')[1];
    const payload = TokenPair.unpackToken(token);
    if (!payload)
      throw new UnauthorizedException('accessToken is invalid or expired');

    const ban = await this.banRepo.get(payload.userId);
    if (ban?.isBanned) throw new UnauthorizedException('User is banned');

    return payload;
  }
}
