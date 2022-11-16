import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser = require('cookie-parser');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationOptions } from './common/utils/validation.options';
import * as config from './config/root';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(config.port);
}
bootstrap();
