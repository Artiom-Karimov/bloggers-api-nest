import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PageViewModel from '../src/common/models/page.view.model';
import BlogViewModel from '../src/modules/blogs/models/blog.view.model';
import BlogSampleGenerator from './utils/blog.sample.generator';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';
import { dateRegex } from '../src/common/utils/date.generator';
import BlogInputModel from '../src/modules/blogs/models/blog.input.model';

jest.useRealTimers();

describe('BloggerController (e2e)', () => {
  const base = '/blogger/blogs';
  let app: INestApplication;
  let samples: BlogSampleGenerator;
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

    expect(body).toEqual(emptyPage);
  });

  let sample: BlogInputModel;
  let expectedBlog: any;
  let createdBlog: BlogViewModel;

  it('should be able to create blog', async () => {
    sample = samples.generateSamples(1)[0];
    expectedBlog = {
      id: expect.any(String),
      name: sample.name,
      description: sample.description,
      websiteUrl: sample.websiteUrl,
      createdAt: expect.stringMatching(dateRegex),
    };

    const response = await request(app.getHttpServer())
      .post(base)
      .set('Authorization', `Bearer ${bloggerTokens.access}`)
      .send(sample);

    expect(response.body).toEqual(expectedBlog);
    createdBlog = response.body;
  });
  it('should get created blog', async () => {
    const response = await await request(app.getHttpServer())
      .get(base)
      .set('Authorization', `Bearer ${bloggerTokens.access}`);

    const expected = {
      pagesCount: 1,
      page: 1,
      pageSize: expect.any(Number),
      totalCount: 1,
      items: [expectedBlog],
    };
    expect(response.body).toEqual(expected);
  });
  it('should not get blogs', async () => {
    const response = await request(app.getHttpServer())
      .get(base)
      .set('Authorization', `Bearer ${userTokens.access}`);

    expect(response.body).toEqual(emptyPage);
  });

  let changedBlogSample: BlogInputModel;

  it('should not change blog', async () => {
    changedBlogSample = samples.generateSamples(1)[0];
    const response = await request(app.getHttpServer())
      .put(`${base}/${createdBlog.id}`)
      .set('Authorization', `Bearer ${userTokens.access}`)
      .send(changedBlogSample);

    expect(response.statusCode).toBe(403);
  });

  it('should change blog', async () => {
    let response = await request(app.getHttpServer())
      .put(`${base}/${createdBlog.id}`)
      .set('Authorization', `Bearer ${bloggerTokens.access}`)
      .send(changedBlogSample);

    expect(response.statusCode).toBe(204);

    expectedBlog = {
      id: createdBlog.id,
      name: changedBlogSample.name,
      description: changedBlogSample.description,
      websiteUrl: changedBlogSample.websiteUrl,
      createdAt: expect.stringMatching(dateRegex),
    };

    response = await request(app.getHttpServer())
      .get(base)
      .set('Authorization', `Bearer ${bloggerTokens.access}`);
    const body = response.body as PageViewModel<BlogViewModel>;
    expect(body.items[0]).toEqual(expectedBlog);
  });
  it('should not delete blog', async () => {
    changedBlogSample = samples.generateSamples(1)[0];
    const response = await request(app.getHttpServer())
      .delete(`${base}/${createdBlog.id}`)
      .set('Authorization', `Bearer ${userTokens.access}`);

    expect(response.statusCode).toBe(403);
  });
  it('should delete blog', async () => {
    let response = await request(app.getHttpServer())
      .delete(`${base}/${createdBlog.id}`)
      .set('Authorization', `Bearer ${bloggerTokens.access}`);
    expect(response.statusCode).toBe(204);

    response = await request(app.getHttpServer())
      .get(base)
      .set('Authorization', `Bearer ${bloggerTokens.access}`);

    expect(response.body).toEqual(emptyPage);
  });
});
