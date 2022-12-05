import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';
import TokenPayload from '../models/jwt/token.payload';
import SessionsRepository from '../sessions.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly repo: SessionsRepository) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.cookies['refreshToken'];
    if (!token) throw new UnauthorizedException('No refreshToken in cookies');
    req.user = await this.authorize(token);
    req.refreshToken = token;

    return true;
  }

  private async authorize(token: string): Promise<TokenPayload> {
    const payload = TokenPair.unpackToken(token);
    if (!payload)
      throw new UnauthorizedException('refreshToken is invalid or expired');
    const session = await this.repo.get(payload.deviceId);
    if (!session || session.issuedAt !== payload.issuedAt)
      throw new UnauthorizedException('refreshToken is invalid or expired');

    return payload;
  }
}
