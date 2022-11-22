import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PageViewModel from '../src/common/models/page.view.model';
import BlogViewModel from '../src/modules/blogs/models/blog.view.model';
import BlogSampleGenerator from './utils/blog.sample.generator';
import * as config from '../src/config/admin';
import { dateRegex } from '../src/common/utils/date.generator';
import UserSampleGenerator from './utils/user.sample.generator';

jest.useRealTimers();

describe('AdminController (e2e)', () => {
  const blogBase = '/sa/blogs';
  const userBase = '/sa/users';
  let app: INestApplication;
  let blogSamples: BlogSampleGenerator;
  let userSamples: UserSampleGenerator;

  const emptyPage = {
    pagesCount: 0,
    page: 1,
    pageSize: expect.any(Number),
    totalCount: 0,
    items: [],
  };

  beforeAll(async () => {
    app = await init();
    blogSamples = new BlogSampleGenerator(app);
    userSamples = new UserSampleGenerator(app);
    await request(app.getHttpServer()).delete('/testing/all-data');
  }, 10000);
  afterAll(async () => {
    await stop();
  });

  it('unauthorized if no auth', async () => {
    const noAuth = [
      request(app.getHttpServer()).get(blogBase),
      request(app.getHttpServer())
        .put(`${blogBase}/123/bind-with-user/432`)
        .send('boo!'),
      request(app.getHttpServer()).get(userBase),
      request(app.getHttpServer()).post(userBase).send('poop!'),
      request(app.getHttpServer()).put(`${userBase}/qweruio/ban`).send('poop!'),
      request(app.getHttpServer()).delete(`${userBase}/qwerui`),
    ];
    const noAuthResults = await Promise.all(noAuth);
    for (const res of noAuthResults) {
      expect(res.statusCode).toBe(401);
    }
  });
  it('unauthorized if wrong credentials', async () => {
    const noAuth = [
      request(app.getHttpServer()).get(blogBase),
      request(app.getHttpServer())
        .put(`${blogBase}/123/bind-with-user/432`)
        .send('boo!'),
      request(app.getHttpServer())
        .get(userBase)
        .auth(config.userName, 'hell-o'),
      request(app.getHttpServer())
        .post(userBase)
        .send('poop!')
        .auth('userName', 'hell-o'),
      request(app.getHttpServer())
        .put(`${userBase}/qweruio/ban`)
        .send('poop!')
        .auth('letMeIn', config.password),
      request(app.getHttpServer()).delete(`${userBase}/qwerui`).auth('', ''),
    ];
    const noAuthResults = await Promise.all(noAuth);
    for (const res of noAuthResults) {
      expect(res.statusCode).toBe(401);
    }
  });
});
