import * as request from 'supertest';
import BlogInputModel from '../../src/modules/blogs/blogs/models/input/blog.input.model';
import TestSampleGenerator from './test.sample.generator';
import UserInputModel from '../../src/modules/users/models/input/user.input.model';
import { INestApplication } from '@nestjs/common';
import UserSampleGenerator, { Tokens } from './user.sample.generator';
import BlogViewModel from '../../src/modules/blogs/blogs/models/view/blog.view.model';

export default class BlogSampleGenerator extends TestSampleGenerator<
  BlogInputModel,
  BlogViewModel
> {
  private readonly userGenerator: UserSampleGenerator;

  get user(): UserInputModel {
    return this.userGenerator.samples[0];
  }
  public tokens: Tokens = undefined;

  constructor(app: INestApplication) {
    super(app);
    this.userGenerator = new UserSampleGenerator(app);
    this.userGenerator.generateOne();
  }

  public generateOne(): BlogInputModel {
    const rand = this.rand();
    const sample = {
      name: `Blog ${rand}`,
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
  public async removeOne(id: string): Promise<void> {
    const req = request(this.app.getHttpServer())
      .delete(`/blogger/blogs/${id}`)
      .set('Authorization', `Bearer ${this.tokens.access}`);

    this.removeFromArrays(id, 'name');
    await req;
  }

  protected alreadyCreated(sample: BlogInputModel): boolean {
    return this.outputs.some((o) => o.name === sample.name);
  }
  private async checkUser() {
    if (this.userGenerator.outputs.length === 0)
      await this.userGenerator.createSamples();
    if (!this.tokens) this.tokens = await this.userGenerator.login(this.user);
  }
}
