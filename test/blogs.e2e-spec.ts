import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PageViewModel from '../src/common/models/page.view.model';
import BlogViewModel from '../src/modules/blogs/models/blog.view.model';
import BlogSampleGenerator from './utils/blog.sample.generator';
import * as config from '../src/config/admin';

jest.useRealTimers();

describe('BlogsController (e2e)', () => {
  const base = '/blogs';
  let app: INestApplication;
  let samples: BlogSampleGenerator;

  beforeAll(async () => {
    app = await init();
    samples = new BlogSampleGenerator(app);
    await request(app.getHttpServer()).delete('/testing/all-data');
  }, 20000);
  afterAll(async () => {
    await stop();
  });

  it('result should be empty', async () => {
    const result = await request(app.getHttpServer()).get(base).expect(200);
    const body = result.body as PageViewModel<BlogViewModel>;
    expect(body.totalCount).toBe(0);
    expect(body.items.length).toBe(0);
  });

  let blogId: string;

  it('should create new blog', async () => {
    const sample = samples.generateSamples(1)[0];
    const response = await request(app.getHttpServer())
      .post(base)
      .auth(config.userName, config.password)
      .send(sample);
    expect(response.statusCode).toBe(201);
    const body = response.body as BlogViewModel;
    expect(body.name).toBe(sample.name);
    expect(body.youtubeUrl).toBe(sample.youtubeUrl);
    expect(body.createdAt).toBeTruthy();
    blogId = body.id;
  });

  it('should get created blog', async () => {
    const blogs = await request(app.getHttpServer()).get(base);
    const body = blogs.body as PageViewModel<BlogViewModel>;
    expect(body.items.length).toBe(1);
    expect(body.totalCount).toBe(1);

    const blog = body.items[0];
    const sample = samples.samples[0];
    expect(blog.name).toBe(sample.name);
    expect(blog.youtubeUrl).toBe(sample.youtubeUrl);
    expect(blog.id).toBe(blogId);

    const retrieved = await request(app.getHttpServer()).get(
      `${base}/${blog.id}`,
    );
    const rBody = retrieved.body as BlogViewModel;
    expect(blog).toEqual(rBody);
  });

  it('should update blog', async () => {
    const oldResult = await request(app.getHttpServer()).get(
      `${base}/${blogId}`,
    );
    const blog = oldResult.body as BlogViewModel;

    const newSample = samples.generateSamples(1)[0];
    const result = await request(app.getHttpServer())
      .put(`${base}/${blog.id}`)
      .auth(config.userName, config.password)
      .send(newSample);

    expect(result.statusCode).toBe(204);

    const newResult = await request(app.getHttpServer()).get(
      `${base}/${blogId}`,
    );
    const newBlog = newResult.body as BlogViewModel;
    expect(newBlog.name).toBe(newSample.name);
    expect(newBlog.youtubeUrl).toBe(newSample.youtubeUrl);
  });

  it('shuld delete blog', async () => {
    const deleted = await await request(app.getHttpServer())
      .delete(`${base}/${blogId}`)
      .auth(config.userName, config.password);
    expect(deleted.statusCode).toBe(204);

    const retrieved = await request(app.getHttpServer()).get(
      `${base}/${blogId}`,
    );
    expect(retrieved.statusCode).toBe(404);
  });

  it('clear data', async () => {
    await request(app.getHttpServer()).delete('/testing/all-data');
  });
});
