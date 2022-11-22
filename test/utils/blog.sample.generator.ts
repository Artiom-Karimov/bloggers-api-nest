import * as request from 'supertest';
import BlogInputModel from '../../src/modules/blogs/models/blog.input.model';
import BlogViewModel from '../../src/modules/blogs/models/blog.view.model';
import TestSampleGenerator from './test.sample.generator';
import UserInputModel from '../../src/modules/users/models/user.input.model';
import { INestApplication } from '@nestjs/common';
import UserSampleGenerator, { Tokens } from './user.sample.generator';

export default class BlogSampleGenerator extends TestSampleGenerator<
  BlogInputModel,
  BlogViewModel
> {
  public readonly user: UserInputModel;
  private readonly userGenerator: UserSampleGenerator;
  private tokens: Tokens = undefined;

  constructor(app: INestApplication) {
    super(app);
    this.userGenerator = new UserSampleGenerator(app);
    this.user = this.userGenerator.generateSamples(1)[0];
  }

  public override generateSamples(length: number): Array<BlogInputModel> {
    for (let i = 0; i < length; i++) {
      const rand = this.rand();
      this.samples.push({
        name: `sampleBlog ${rand}`,
        websiteUrl: `https://blog${rand}.com`,
        description: `Blog description\nNumber ${rand}`,
      });
    }
    return this.getLastSamples(length);
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
