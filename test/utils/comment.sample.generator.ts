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
    this.user = this.userGenerator.generateSamples(1)[0];
    this.postId = postId;
  }

  public generateSamples(length: number): CommentInputModel[] {
    // for (let i = 0; i < length; i++) {
    //   const rand = this.rand();
    //   this.samples.push({
    //     name: `sampleBlog ${rand}`,
    //     websiteUrl: `https://blog${rand}.com`,
    //     description: `Blog description\nNumber ${rand}`,
    //   });
    // }
    return this.getLastSamples(length);
  }
  public createOne(sample: CommentInputModel): Promise<CommentViewModel> {
    throw new Error('Method not implemented.');
  }
}
