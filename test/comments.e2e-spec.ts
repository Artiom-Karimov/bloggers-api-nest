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
  const viewModel: any = {
    id: expect.any(String),
    content: expect.any(String),
    userId: expect.any(String),
    userLogin: expect.any(String),
    createdAt: expect.stringMatching(dateRegex),
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    },
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
  it('empty page for created post', async () => {
    const result = await request(app.getHttpServer()).get(postBase);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(emptyPage);
  });

  const amount = 8;
  it('should create comments', async () => {
    commentSamples.generateSamples(amount);
    expect(commentSamples.samples.length).toBe(amount);
    await commentSamples.createSamples();
    expect(commentSamples.outputs.length).toBe(amount);
  }, 8000);
  it('created comments should match model', () => {
    const model = {
      ...viewModel,
      userId: commentSamples.userId,
      userLogin: commentSamples.user.login,
    };
    for (const c of commentSamples.outputs) {
      expect(c).toEqual(model);
    }
    commentSamples.samples.forEach((s) => {
      const found = commentSamples.outputs.some((c) => c.content === s.content);
      expect(found).toBe(true);
    });
  });
  it('get page with created comments', async () => {
    const result = await request(app.getHttpServer()).get(postBase);
    expect(result.statusCode).toBe(200);
    const expected = {
      ...emptyPage,
      pagesCount: 1,
      pageSize: 10,
      totalCount: amount,
      items: expect.arrayContaining(commentSamples.outputs),
    };
    expect(result.body).toEqual(expected);
  });
});
