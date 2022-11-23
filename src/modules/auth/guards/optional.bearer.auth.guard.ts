import { Injectable, ExecutionContext } from '@nestjs/common';
import { BearerAuthGuard } from './bearer.auth.guard';

@Injectable()
export class OptionalBearerAuthGuard extends BearerAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch (error) {
      return true;
    }
  }
}
