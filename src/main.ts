import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser = require('cookie-parser');
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationOptions } from './common/utils/validation.options';
import * as config from './config/root';
import { AllExceptionsFilter } from './common/utils/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(config.port);
}
bootstrap();
