import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestAppModule } from '../test.app.module';

let app: INestApplication;

export const init = async (): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [TestAppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};
export const stop = async () => {
  await app.close();
};
