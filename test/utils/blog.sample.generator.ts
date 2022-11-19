import * as request from 'supertest';
import BlogInputModel from '../../src/modules/blogs/models/blog.input.model';
import BlogViewModel from '../../src/modules/blogs/models/blog.view.model';
import TestSampleGenerator from './test.sample.generator';
import * as config from '../../src/config/admin';

export default class BlogSampleGenerator extends TestSampleGenerator<
  BlogInputModel,
  BlogViewModel
> {
  public override generateSamples(length: number): Array<BlogInputModel> {
    for (let i = 0; i < length; i++) {
      const rand = this.rand();
      this.samples.push({
        name: `sampleBlog ${rand}`,
        websiteUrl: `https://blog${rand}.com`,
      });
    }
    return this.getLastSamples(length);
  }
  public override async createOne(
    sample: BlogInputModel,
  ): Promise<BlogViewModel> {
    const created = await request(this.app.getHttpServer)
      .post('/blogs')
      .auth(config.userName, config.password)
      .send(sample);
    return created.body as BlogViewModel;
  }
}
