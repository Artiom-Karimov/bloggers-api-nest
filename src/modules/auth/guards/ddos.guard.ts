import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import * as config from '../../../config/users';

type Action = {
  ip: string;
  endpoint: string;
  timestamp: number;
};

@Injectable()
export class DdosGuard implements CanActivate {
  private history: Action[] = [];

  canActivate(context: ExecutionContext): boolean {
    if (config.ddosGuardDisable) return true;
    this.flushOutdated();
    const req: Request = context.switchToHttp().getRequest();
    const action = this.getAction(req);
    this.history.push(action);
    if (this.checkHistory(action)) return true;
    throw new HttpException('Too many attempts', 429);
  }

  private flushOutdated() {
    const fromTime = Date.now() - config.ddosTimeoutSeconds * 1000;
    this.history = this.history.filter((a) => a.timestamp > fromTime);
  }
  private getAction(req: Request): Action {
    return {
      ip: req.ip,
      endpoint: req.path,
      timestamp: Date.now(),
    };
  }
  private checkHistory(action: Action): boolean {
    return (
      this.history.filter(
        (a) => a.ip === action.ip && a.endpoint === action.endpoint,
      ).length <= config.ddosMaxRequests
    );
  }
}
