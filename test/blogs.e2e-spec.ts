import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PageViewModel from '../src/common/models/page.view.model';
import BlogSampleGenerator from './utils/blog.sample.generator';
import * as config from '../src/config/admin';
import BlogViewModel from '../src/modules/blogs/models/blogs/blog.view.model';

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
    samples.generateSamples(1)[0];
    await samples.createSamples();
    const blog = samples.outputs[0];
    expect(blog).toBeTruthy();
    blogId = blog.id;
  });

  it('should get created blog', async () => {
    const blogs = await request(app.getHttpServer()).get(base);
    const body = blogs.body as PageViewModel<BlogViewModel>;
    expect(body.items.length).toBe(1);
    expect(body.totalCount).toBe(1);

    const blog = body.items[0];
    const sample = samples.samples[0];
    expect(blog.name).toBe(sample.name);
    expect(blog.websiteUrl).toBe(sample.websiteUrl);
    expect(blog.id).toBe(blogId);

    const retrieved = await request(app.getHttpServer()).get(
      `${base}/${blog.id}`,
    );
    const rBody = retrieved.body as BlogViewModel;
    expect(blog).toEqual(rBody);
  });
});
