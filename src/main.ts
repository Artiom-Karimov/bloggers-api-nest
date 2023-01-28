import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser = require('cookie-parser');
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationOptions } from './common/utils/validation.options';
import * as config from './config/root';
import { AllExceptionsFilter } from './common/utils/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Bloggers API')
    .setDescription(
      'App where users can create their own blogs, comment and like other user posts',
    )
    .setVersion('2.0.2')
    .addBasicAuth()
    .addBearerAuth()
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerSetup(app);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(config.port);
}
bootstrap();
