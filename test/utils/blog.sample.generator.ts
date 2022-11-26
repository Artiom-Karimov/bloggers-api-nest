import * as request from 'supertest';
import BlogInputModel from '../../src/modules/blogs/blogs/models/blog.input.model';
import TestSampleGenerator from './test.sample.generator';
import UserInputModel from '../../src/modules/users/models/user.input.model';
import { INestApplication } from '@nestjs/common';
import UserSampleGenerator, { Tokens } from './user.sample.generator';
import BlogViewModel from '../../src/modules/blogs/blogs/models/blog.view.model';

export default class BlogSampleGenerator extends TestSampleGenerator<
  BlogInputModel,
  BlogViewModel
> {
  public readonly user: UserInputModel;
  private readonly userGenerator: UserSampleGenerator;
  public tokens: Tokens = undefined;

  constructor(app: INestApplication) {
    super(app);
    this.userGenerator = new UserSampleGenerator(app);
    this.user = this.userGenerator.generateOne();
  }

  public generateOne(): BlogInputModel {
    const rand = this.rand();
    const sample = {
      name: `sampleBlog ${rand}`,
      websiteUrl: `https://blog${rand}.com`,
      description: `Blog description\nNumber ${rand}`,
    };
    this.samples.push(sample);
    return sample;
  }
  public override async createOne(
    sample: BlogInputModel,
  ): Promise<BlogViewModel> {
    await this.checkUser();

    const created = await request(this.app.getHttpServer())
      .post('/blogger/blogs')
      .set('Authorization', `Bearer ${this.tokens.access}`)
      .send(sample);
    return created.body as BlogViewModel;
  }
  private async checkUser() {
    if (this.userGenerator.outputs.length === 0)
      await this.userGenerator.createSamples();
    if (!this.tokens) this.tokens = await this.userGenerator.login(this.user);
  }
}
