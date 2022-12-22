import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpServer,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger;
  constructor(applicationRef?: HttpServer) {
    super(applicationRef);
    this.logger = new Logger('ExceptionFilter');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception);
    }
    super.catch(exception, host);
  }
}
