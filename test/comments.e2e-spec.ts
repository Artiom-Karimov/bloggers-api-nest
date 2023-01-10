import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PostSampleGenerator from './utils/post.sample.generator';
import CommentSampleGenerator from './utils/comment.sample.generator';
import CommentViewModel from '../src/modules/blogs/comments/models/view/comment.view.model';
import { regex } from '../src/common/utils/validation.regex';

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
    createdAt: expect.stringMatching(regex.isoDate),
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

  it('>= 400 for non-existing post', async () => {
    const result = await request(app.getHttpServer()).get(
      '/posts/1234abc/comments',
    );
    expect(result.statusCode).toBeGreaterThanOrEqual(400);
    expect(result.statusCode).toBeLessThan(500);
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

  let comment: CommentViewModel;
  it('change comment content', async () => {
    comment = commentSamples.outputs[0];
    const data = { content: 'changed comment content' };

    let response = await request(app.getHttpServer())
      .put(`${base}/${comment.id}`)
      .set('Authorization', `Bearer ${commentSamples.tokens.access}`)
      .send(data);

    expect(response.statusCode).toBe(204);

    response = await request(app.getHttpServer()).get(`${base}/${comment.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ...comment,
      content: data.content,
    });
  });
  it('delete comment', async () => {
    let response = await request(app.getHttpServer())
      .delete(`${base}/${comment.id}`)
      .set('Authorization', `Bearer ${commentSamples.tokens.access}`);
    expect(response.statusCode).toBe(204);

    response = await request(app.getHttpServer()).get(`${base}/${comment.id}`);
    expect(response.statusCode).toBe(404);

    await commentSamples.removeOne(comment.id);
  });

  it('put like', async () => {
    comment = commentSamples.outputs[0];
    let response = await request(app.getHttpServer())
      .put(`${base}/${comment.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', `Bearer ${commentSamples.tokens.access}`);
    expect(response.statusCode).toBe(204);

    response = await request(app.getHttpServer())
      .get(`${base}/${comment.id}`)
      .set('Authorization', `Bearer ${commentSamples.tokens.access}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ...comment,
      likesInfo: {
        likesCount: 1,
        dislikesCount: 0,
        myStatus: 'Like',
      },
    });
  });
});
