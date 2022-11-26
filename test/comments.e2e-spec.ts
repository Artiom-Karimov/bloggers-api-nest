import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import { dateRegex } from '../src/common/utils/date.generator';
import PostSampleGenerator from './utils/post.sample.generator';
import CommentSampleGenerator from './utils/comment.sample.generator';

jest.useRealTimers();

describe('CommentsController (e2e)', () => {
  const base = '/comments';
  let app: INestApplication;
  let postId: string;
  let postBase: string;
  let postSamples: PostSampleGenerator;
  let commentSamples: CommentSampleGenerator;

  const emptyPage = {
    pagesCount: 0,
    page: 1,
    pageSize: expect.any(Number),
    totalCount: 0,
    items: [],
  };

  beforeAll(async () => {
    app = await init();

    await request(app.getHttpServer()).delete('/testing/all-data');

    postSamples = new PostSampleGenerator(app);
    postSamples.generateOne();
    await postSamples.createSamples();

    postId = postSamples.outputs[0].id;
    postBase = `/posts/${postId}/comments`;

    commentSamples = new CommentSampleGenerator(app, postId);
  }, 20000);
  afterAll(async () => {
    await stop();
  });

  it('404 for non-existing post', async () => {
    const result = await request(app.getHttpServer()).get(
      '/posts/1234abc/comments',
    );
    expect(result.statusCode).toBe(404);
  });
});
