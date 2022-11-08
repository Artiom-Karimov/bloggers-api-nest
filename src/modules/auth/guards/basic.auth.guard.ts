import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as config from '../../../config/admin';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly rightHeader: string;

  constructor() {
    const base64Creds = Buffer.from(
      `${config.userName}:${config.password}`,
      'utf-8',
    ).toString('base64');
    this.rightHeader = `Basic ${base64Creds}`;
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization)
      throw new UnauthorizedException('You should use Basic auth');
    return this.authorize(request.headers.authorization);
  }
  private authorize(authHeader: string): boolean {
    if (!authHeader.startsWith('Basic '))
      throw new UnauthorizedException('You should use Basic auth');

    if (authHeader !== this.rightHeader)
      throw new UnauthorizedException('Wrong credentials');

    return true;
  }
}
