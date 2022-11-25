import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import PostInputModel from '../../src/modules/blogs/posts/models/post.input.model';
import PostViewModel from '../../src/modules/blogs/posts/models/post.view.model';
import UserInputModel from '../../src/modules/users/models/user.input.model';
import BlogSampleGenerator from './blog.sample.generator';
import TestSampleGenerator from './test.sample.generator';
import { Tokens } from './user.sample.generator';
import BlogInputModel from '../../src/modules/blogs/blogs/models/blog.input.model';

export default class PostSampleGenerator extends TestSampleGenerator<
  PostInputModel,
  PostViewModel
> {
  public readonly user: UserInputModel;
  public readonly blog: BlogInputModel;

  public tokens: Tokens = undefined;
  public blogId: string = undefined;

  private readonly blogGenerator: BlogSampleGenerator;

  constructor(app: INestApplication) {
    super(app);
    this.blogGenerator = new BlogSampleGenerator(app);
    this.user = this.blogGenerator.user;
    this.blog = this.blogGenerator.generateSamples(1)[0];
  }

  public override generateSamples(length: number): Array<PostInputModel> {
    for (let i = 0; i < length; i++) {
      const rand = this.rand();
      this.samples.push({
        title: `samplePost ${rand}`,
        shortDescription: `Post description\nNumber ${rand}`,
        content: `Post content with ${rand} litres of liquid sh`,
      });
    }
    return this.getLastSamples(length);
  }
  public override async createOne(
    sample: PostInputModel,
  ): Promise<PostViewModel> {
    await this.checkBlog();

    const created = await request(this.app.getHttpServer())
      .post(`/blogger/blogs/${this.blogId}/posts`)
      .set('Authorization', `Bearer ${this.tokens.access}`)
      .send(sample);
    return created.body as PostViewModel;
  }
  private async checkBlog() {
    if (this.blogGenerator.outputs.length !== 0) return;

    await this.blogGenerator.createSamples();
    this.tokens = this.blogGenerator.tokens;
    this.blogId = this.blogGenerator.outputs[0].id;
  }
}
