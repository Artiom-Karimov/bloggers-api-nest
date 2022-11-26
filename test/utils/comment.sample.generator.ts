import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import CommentInputModel from '../../src/modules/blogs/comments/models/comment.input.model';
import CommentViewModel from '../../src/modules/blogs/comments/models/comment.view.model';
import UserInputModel from '../../src/modules/users/models/user.input.model';
import TestSampleGenerator from './test.sample.generator';
import UserSampleGenerator, { Tokens } from './user.sample.generator';

export default class CommentSampleGenerator extends TestSampleGenerator<
  CommentInputModel,
  CommentViewModel
> {
  public readonly user: UserInputModel;
  private readonly userGenerator: UserSampleGenerator;
  public tokens: Tokens = undefined;
  public postId: string;

  constructor(app: INestApplication, postId: string) {
    super(app);
    this.userGenerator = new UserSampleGenerator(app);
    this.user = this.userGenerator.generateOne();
    this.postId = postId;
  }

  public generateOne(): CommentInputModel {
    const rand = this.rand();
    const sample = {
      content: `This comment is ${rand}% unique.`,
    };
    this.samples.push(sample);
    return sample;
  }
  public async createOne(sample: CommentInputModel): Promise<CommentViewModel> {
    await this.checkUser();

    const created = await request(this.app.getHttpServer())
      .post(`/posts/${this.postId}/comments`)
      .set('Authorization', `Bearer ${this.tokens.access}`)
      .send(sample);
    return created.body as CommentViewModel;
  }
  protected async checkUser() {
    if (this.userGenerator.outputs.length === 0)
      await this.userGenerator.createSamples();
    if (!this.tokens) this.tokens = await this.userGenerator.login(this.user);
  }
}
