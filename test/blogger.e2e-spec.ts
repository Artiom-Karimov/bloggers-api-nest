import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PageViewModel from '../src/common/models/page.view.model';
import BlogViewModel from '../src/modules/blogs/models/blog.view.model';
import BlogSampleGenerator from './utils/blog.sample.generator';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';

jest.useRealTimers();

describe('BloggerController (e2e)', () => {
  const base = '/blogger/blogs';
  let app: INestApplication;
  let samples: BlogSampleGenerator;
  let userSamples: UserSampleGenerator;

  beforeAll(async () => {
    app = await init();
    samples = new BlogSampleGenerator(app);
    userSamples = new UserSampleGenerator(app);
    await request(app.getHttpServer()).delete('/testing/all-data');
  }, 20000);
  afterAll(async () => {
    await stop();
  });

  it('unauthorized without token', async () => {
    const requests = [
      request(app.getHttpServer()).delete(`${base}/12345`),
      request(app.getHttpServer()).put(`${base}/12345`).send({ data: 'data' }),
      request(app.getHttpServer()).post(`${base}`).send({ data: 'data' }),
      request(app.getHttpServer()).get(`${base}`),
    ];
    const responses = await Promise.all(requests);
    for (const r of responses) {
      expect(r.statusCode).toBe(401);
    }
  });

  let bloggerTokens: Tokens;
  let userTokens: Tokens;

  it('create/login user', async () => {
    userSamples.generateSamples(2);
    await userSamples.createSamples();
    bloggerTokens = await userSamples.login(userSamples.samples[0]);
    userTokens = await userSamples.login(userSamples.samples[1]);
    expect(bloggerTokens).toBeTruthy();
    expect(userTokens).toBeTruthy();
  });

  it('get blogs should return empty page', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}`)
      .set('Authorization', `Bearer ${bloggerTokens.access}`);
    const body = result.body as PageViewModel<BlogViewModel>;
    const emptyPage = {
      pagesCount: 0,
      page: 1,
      pageSize: expect.any(Number),
      totalCount: 0,
      items: [],
    };
    expect(body).toEqual(emptyPage);
  });
});
