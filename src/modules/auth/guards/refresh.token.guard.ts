import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import TokenPair from '../models/jwt/token.pair';
import TokenPayload from '../models/jwt/token.payload';
import SessionsService from '../sessions.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly service: SessionsService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.cookies['refreshToken'])
      throw new UnauthorizedException('No refreshToken in cookies');
    req.body.tokenPayload = await this.authorize(req.cookies['refreshToken']);

    return true;
  }

  private async authorize(token: string): Promise<TokenPayload> {
    const payload = TokenPair.unpackRefreshToken(token);
    if (!payload)
      throw new UnauthorizedException('refreshToken is invalid or expired');
    const exists = await this.service.sessionExists(payload.deviceId);
    if (!exists)
      throw new UnauthorizedException('refreshToken is invalid or expired');

    return payload;
  }
}
