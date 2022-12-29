import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PageViewModel from '../src/common/models/page.view.model';
import BlogSampleGenerator from './utils/blog.sample.generator';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';
import { dateRegex } from '../src/common/utils/date.generator';
import BlogInputModel from '../src/modules/blogs/blogs/models/input/blog.input.model';
import PostInputModel from '../src/modules/blogs/posts/models/post.input.model';
import BlogViewModel from '../src/modules/blogs/blogs/models/view/blog.view.model';
import UserViewModel from '../src/modules/users/models/view/user.view.model';
import PostSampleGenerator from './utils/post.sample.generator';
import PostViewModel from '../src/modules/blogs/posts/models/post.view.model';

jest.useRealTimers();

describe('BloggerController (e2e)', () => {
  const base = '/blogger/blogs';
  const userBase = '/blogger/users';
  let app: INestApplication;

  const emptyPage = {
    pagesCount: 0,
    page: 1,
    pageSize: expect.any(Number),
    totalCount: 0,
    items: [],
  };

  beforeAll(async () => {
    app = await init();
  }, 20000);
  afterAll(async () => {
    await stop();
  });

  it('unauthorized without token', async () => {
    const requests = [
      request(app.getHttpServer()).delete(`${base}/12345`),
      request(app.getHttpServer()).put(`${base}/12345`).send({ data: 'data' }),
      request(app.getHttpServer()).post(`${base}`).send({ data: 'data' }),
      request(app.getHttpServer()).get(`${base}`),
      request(app.getHttpServer()).post(`${base}/ijtijt/posts`).send('hello'),
      request(app.getHttpServer())
        .put(`${base}/6497236/posts/htw84t`)
        .send('hello'),
      request(app.getHttpServer()).delete(`${base}/6497236/posts/htw84t`),
      request(app.getHttpServer()).put(`${userBase}/6497236/ban`),
      request(app.getHttpServer()).get(`${userBase}/blog/875360983457`),
    ];
    const responses = await Promise.all(requests);
    for (const r of responses) {
      expect(r.statusCode).toBe(401);
    }
  });

  describe('blogger crud tests', () => {
    let samples: BlogSampleGenerator;
    let userSamples: UserSampleGenerator;
    let bloggerTokens: Tokens;
    let userTokens: Tokens;

    beforeAll(async () => {
      samples = new BlogSampleGenerator(app);
      userSamples = new UserSampleGenerator(app);
      await request(app.getHttpServer()).delete('/testing/all-data');
    });

    let sample: BlogInputModel;
    let expectedBlog: any;
    let createdBlog: BlogViewModel;

    it('create/login user', async () => {
      userSamples.generateOne();
      await userSamples.createSamples();
      userTokens = await userSamples.login(userSamples.samples[0]);
    });

    it('get blogs should return empty page', async () => {
      const result = await request(app.getHttpServer())
        .get(`${base}`)
        .set('Authorization', `Bearer ${userTokens.access}`);
      const body = result.body as PageViewModel<BlogViewModel>;

      expect(body).toEqual(emptyPage);
    });
    it('get posts should return 404', async () => {
      const result = await request(app.getHttpServer())
        .get(`${base}/greghrghi/posts`)
        .set('Authorization', `Bearer ${userTokens.access}`);

      expect(result.statusCode).toBe(404);
    });

    it('should be able to create blog', async () => {
      sample = samples.generateOne();
      expectedBlog = {
        id: expect.any(String),
        name: sample.name,
        description: sample.description,
        websiteUrl: sample.websiteUrl,
        createdAt: expect.stringMatching(dateRegex),
      };

      await samples.createSamples();

      expect(samples.outputs[0]).toEqual(expectedBlog);
      createdBlog = samples.outputs[0];

      bloggerTokens = samples.tokens;
    });
    it('should get created blog', async () => {
      const response = await request(app.getHttpServer())
        .get(base)
        .set('Authorization', `Bearer ${bloggerTokens.access}`);

      const expected = {
        pagesCount: 1,
        page: 1,
        pageSize: expect.any(Number),
        totalCount: 1,
        items: [expectedBlog],
      };
      expect(response.body).toEqual(expected);
    });
    it('should not get blogs', async () => {
      const response = await request(app.getHttpServer())
        .get(base)
        .set('Authorization', `Bearer ${userTokens.access}`);

      expect(response.body).toEqual(emptyPage);
    });

    let postId: string;
    it('should create post for blog', async () => {
      const sample: PostInputModel = {
        title: 'samplePost',
        shortDescription: 'the description',
        content: 'post contentus',
      };

      const response = await request(app.getHttpServer())
        .post(`${base}/${createdBlog.id}/posts`)
        .set('Authorization', `Bearer ${bloggerTokens.access}`)
        .send(sample);
      expect(response.statusCode).toBe(201);

      const expected = {
        id: expect.any(String),
        title: sample.title,
        shortDescription: sample.shortDescription,
        content: sample.content,
        blogId: createdBlog.id,
        blogName: createdBlog.name,
        createdAt: expect.stringMatching(dateRegex),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
      expect(response.body).toEqual(expected);
      postId = response.body.id;
    });
    it('should update post', async () => {
      const sample: PostInputModel = {
        title: 'updatedTitle',
        shortDescription: 'dooscreeption',
        content: 'brand new content',
      };

      let response = await request(app.getHttpServer())
        .put(`${base}/${createdBlog.id}/posts/${postId}`)
        .set('Authorization', `Bearer ${bloggerTokens.access}`)
        .send(sample);
      expect(response.statusCode).toBe(204);

      response = await request(app.getHttpServer()).get(`/posts/${postId}`);
      expect(response.statusCode).toBe(200);

      const expected = {
        id: expect.any(String),
        title: sample.title,
        shortDescription: sample.shortDescription,
        content: sample.content,
        blogId: createdBlog.id,
        blogName: createdBlog.name,
        createdAt: expect.stringMatching(dateRegex),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
      expect(response.body).toEqual(expected);
    });
    it('should delete post', async () => {
      let response = await request(app.getHttpServer())
        .delete(`${base}/${createdBlog.id}/posts/${postId}`)
        .set('Authorization', `Bearer ${bloggerTokens.access}`);
      expect(response.statusCode).toBe(204);

      response = await request(app.getHttpServer()).get(`/posts/${postId}`);
      expect(response.statusCode).toBe(404);
    });

    let changedBlogSample: BlogInputModel;

    it('should not change blog', async () => {
      changedBlogSample = samples.generateSamples(1)[0];
      const response = await request(app.getHttpServer())
        .put(`${base}/${createdBlog.id}`)
        .set('Authorization', `Bearer ${userTokens.access}`)
        .send(changedBlogSample);

      expect(response.statusCode).toBe(403);
    });

    it('should change blog', async () => {
      let response = await request(app.getHttpServer())
        .put(`${base}/${createdBlog.id}`)
        .set('Authorization', `Bearer ${bloggerTokens.access}`)
        .send(changedBlogSample);

      expect(response.statusCode).toBe(204);

      expectedBlog = {
        id: createdBlog.id,
        name: changedBlogSample.name,
        description: changedBlogSample.description,
        websiteUrl: changedBlogSample.websiteUrl,
        createdAt: expect.stringMatching(dateRegex),
      };

      response = await request(app.getHttpServer())
        .get(base)
        .set('Authorization', `Bearer ${bloggerTokens.access}`);
      const body = response.body as PageViewModel<BlogViewModel>;
      expect(body.items[0]).toEqual(expectedBlog);
    });
    it('should not delete blog', async () => {
      changedBlogSample = samples.generateSamples(1)[0];
      const response = await request(app.getHttpServer())
        .delete(`${base}/${createdBlog.id}`)
        .set('Authorization', `Bearer ${userTokens.access}`);

      expect(response.statusCode).toBe(403);
    });
    it('should delete blog', async () => {
      let response = await request(app.getHttpServer())
        .delete(`${base}/${createdBlog.id}`)
        .set('Authorization', `Bearer ${bloggerTokens.access}`);
      expect(response.statusCode).toBe(204);

      response = await request(app.getHttpServer())
        .get(base)
        .set('Authorization', `Bearer ${bloggerTokens.access}`);

      expect(response.body).toEqual(emptyPage);
    });
  });

  describe('ban users for blogger tests', () => {
    let postSamples: PostSampleGenerator;
    let userSamples: UserSampleGenerator;
    let user: UserViewModel;
    let userTokens: Tokens;
    let post: PostViewModel;

    beforeAll(async () => {
      postSamples = new PostSampleGenerator(app);
      userSamples = new UserSampleGenerator(app);
      await request(app.getHttpServer()).delete('/testing/all-data');
    });

    it('create/login user, create post', async () => {
      userSamples.generateOne();
      await userSamples.createSamples();
      user = userSamples.outputs[0];
      userTokens = await userSamples.login(userSamples.samples[0]);

      postSamples.generateOne();
      await postSamples.createSamples();
      post = postSamples.outputs[0];
    });

    const content = "We don't need no education!";
    it('not-banned user should create comment', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${userTokens.access}`)
        .send({ content: content })
        .expect(201);
    });
    it('blogger should get comment', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/comments`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .expect(200);
      expect(response.body).toEqual({
        ...emptyPage,
        totalCount: 1,
        pagesCount: 1,
        items: [
          {
            id: expect.any(String),
            content: content,
            createdAt: expect.stringMatching(dateRegex),
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
            },
            commentatorInfo: {
              userId: user.id,
              userLogin: user.login,
            },
            postInfo: {
              id: post.id,
              title: post.title,
              blogId: post.blogId,
              blogName: post.blogName,
            },
          },
        ],
      });
    });

    it('user should create dislike', async () => {
      await request(app.getHttpServer())
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userTokens.access}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
    });
    it('blogger should get dislike', async () => {
      const response = await request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .expect(200);
      expect(response.body).toEqual({
        ...post,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 1,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    });

    const banReason = "How can you have any pudding if you don't eat meat?";
    it('blogger should ban user', async () => {
      const result = await request(app.getHttpServer())
        .put(`${userBase}/${user.id}/ban`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .send({
          isBanned: true,
          banReason,
          blogId: post.blogId,
        });
      expect(result.statusCode).toBe(204);
    });

    const afterBanContent = "We don't need no thought control!";
    it('banned user should not create comment', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${userTokens.access}`)
        .send({ content: afterBanContent })
        .expect(403);
    });

    it('blogger should not get banned user comments', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/comments`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .expect(200);
      expect(response.body).toEqual(emptyPage);
    });

    it('blogger should get banned user info', async () => {
      const response = await request(app.getHttpServer())
        .get(`${userBase}/blog/${post.blogId}`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .expect(200);
      expect(response.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: expect.any(Number),
        totalCount: 1,
        items: [
          {
            id: user.id,
            login: user.login,
            banInfo: {
              isBanned: true,
              banDate: expect.stringMatching(dateRegex),
              banReason,
            },
          },
        ],
      });
    });

    it('blogger should unban user', async () => {
      await request(app.getHttpServer())
        .put(`${userBase}/${user.id}/ban`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .send({
          isBanned: false,
          banReason,
          blogId: post.blogId,
        })
        .expect(204);
    });

    it('unbanned user should create comment', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${userTokens.access}`)
        .send({ content: afterBanContent })
        .expect(201);
    });

    it('blogger should get comments', async () => {
      const response = await request(app.getHttpServer())
        .get(`${base}/comments`)
        .set('Authorization', `Bearer ${postSamples.tokens.access}`)
        .expect(200);
      expect(response.body).toEqual({
        ...emptyPage,
        totalCount: 2,
        pagesCount: 1,
        items: expect.arrayContaining([
          {
            id: expect.any(String),
            content: afterBanContent,
            createdAt: expect.stringMatching(dateRegex),
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
            },
            commentatorInfo: {
              userId: user.id,
              userLogin: user.login,
            },
            postInfo: {
              id: post.id,
              title: post.title,
              blogId: post.blogId,
              blogName: post.blogName,
            },
          },
        ]),
      });
    });
  });
});
