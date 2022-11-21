import { Injectable, ExecutionContext } from '@nestjs/common';
import { BearerAuthGuard } from './bearer.auth.guard';

@Injectable()
export class OptionalBearerAuthGuard extends BearerAuthGuard {
  override canActivate(context: ExecutionContext): boolean {
    try {
      return super.canActivate(context);
    } catch (error) {
      return true;
    }
  }
}
