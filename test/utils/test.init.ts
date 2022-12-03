import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Test, TestingModule } from '@nestjs/testing';
import { validationOptions } from '../../src/common/utils/validation.options';
import { TestAppModule } from '../test.app.module';
import cookieParser = require('cookie-parser');

export let moduleFixture: TestingModule;
export let app: INestApplication;

export const init = async (): Promise<INestApplication> => {
  moduleFixture = await Test.createTestingModule({
    imports: [TestAppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.use(cookieParser());
  useContainer(app.select(TestAppModule), { fallbackOnErrors: true });
  await app.init();
  return app;
};
export const stop = async () => {
  await app.close();
};
