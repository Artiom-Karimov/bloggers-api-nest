import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import PostSampleGenerator from './utils/post.sample.generator';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';
import PageViewModel from '../src/common/models/page.view.model';
import PostViewModel from '../src/modules/blogs/posts/models/post.view.model';
import { regex } from '../src/common/utils/validation.regex';
import PostInputModel from '../src/modules/blogs/posts/models/post.input.model';
import { LikeViewModel } from '../src/modules/blogs/likes/models/likes.info.model';

jest.useRealTimers();

describe('Posts (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await init();
  });
  afterAll(async () => {
    await stop();
  });

  describe('Posts crud', () => {
    let samples: PostSampleGenerator;
    let userSamples: UserSampleGenerator;

    beforeAll(async () => {
      samples = new PostSampleGenerator(app);
      userSamples = new UserSampleGenerator(app);
      await request(app.getHttpServer()).delete('/testing/all-data');

      userSamples.generateSamples(4);
      await userSamples.createSamples();
    }, 10000);

    const amount = 14;
    it('Create some posts', async () => {
      samples.generateSamples(amount);
      await samples.createSamples();
      expect(samples.outputs.length).toBe(amount);
    });

    it('check created posts format', () => {
      for (const sample of samples.outputs) {
        expect(sample).toEqual({
          id: expect.stringMatching(regex.uuid),
          title: expect.any(String),
          shortDescription: expect.any(String),
          content: expect.any(String),
          blogId: samples.blogId,
          blogName: samples.blog.name,
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        });
      }
    });

    it('check created posts data', () => {
      for (const s of samples.samples) {
        const match = samples.outputs.some((o) => {
          return (
            o.title === s.title &&
            o.shortDescription === s.shortDescription &&
            o.content === s.content
          );
        });
        expect(match).toBe(true);
      }
    });

    it('get posts with pagination', async () => {
      samples.outputs.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      const pageSize = 5;
      let result = await request(app.getHttpServer())
        .get(`/posts?pageSize=${pageSize}&sortBy=title&sortDirection=asc`)
        .expect(200);

      expect(result.body).toEqual(
        new PageViewModel<PostViewModel>(1, pageSize, amount).add(
          ...samples.outputs.slice(0, pageSize),
        ),
      );

      result = await request(app.getHttpServer())
        .get(
          `/posts?pageSize=${pageSize}&pageNumber=2&sortBy=title&sortDirection=asc`,
        )
        .expect(200);

      expect(result.body).toEqual(
        new PageViewModel<PostViewModel>(2, pageSize, amount).add(
          ...samples.outputs.slice(pageSize, pageSize * 2),
        ),
      );
    });

    let oldPost: PostViewModel;
    let newPostSample: PostInputModel;
    it('update post', async () => {
      oldPost = samples.outputs[0];
      newPostSample = samples.generateOne();

      await request(app.getHttpServer())
        .put(`/blogger/blogs/${samples.blogId}/posts/${oldPost.id}`)
        .set('Authorization', `Bearer ${samples.tokens.access}`)
        .send(newPostSample)
        .expect(204);
    });

    it('get updated post', async () => {
      const result = await request(app.getHttpServer())
        .get(`/posts/${oldPost.id}`)
        .expect(200);

      expect(result.body).toEqual({
        ...oldPost,
        ...newPostSample,
      });
    });

    let deletedPost: PostViewModel;
    it('delete post', async () => {
      deletedPost = samples.outputs[amount / 2];
      await request(app.getHttpServer())
        .delete(`/blogger/blogs/${samples.blogId}/posts/${deletedPost.id}`)
        .set('Authorization', `Bearer ${samples.tokens.access}`)
        .expect(204);
    });

    it('get deleted post', async () => {
      await request(app.getHttpServer())
        .get(`/posts/${deletedPost.id}`)
        .expect(404);
    });

    it('get all posts. Check updated and deleted', async () => {
      const result = await request(app.getHttpServer())
        .get(`/posts?pageSize=${amount}`)
        .expect(200);

      const view = result.body as PageViewModel<PostViewModel>;
      expect(view.items.length).toBe(amount - 1);
      expect(view.totalCount).toBe(amount - 1);
      const deletedIdPresent = view.items.some((i) => i.id === deletedPost.id);
      expect(deletedIdPresent).toBe(false);
      const notModifiedDataPresent = view.items.some((i) => {
        return i.content === oldPost.content;
      });
      expect(notModifiedDataPresent).toBe(false);
    });
  });

  describe('Post likes', () => {
    let samples: PostSampleGenerator;
    let userSamples: UserSampleGenerator;
    const loginTokens = new Map<string, string>();
    const usersAmount = 4; // just leave as 4

    beforeAll(async () => {
      samples = new PostSampleGenerator(app);
      userSamples = new UserSampleGenerator(app);
      await request(app.getHttpServer()).delete('/testing/all-data');
      userSamples.generateSamples(usersAmount);
      await userSamples.createSamples();
    }, 10000);

    const amount = 3;
    it('Create some posts', async () => {
      samples.generateSamples(amount);
      await samples.createSamples();
      expect(samples.outputs.length).toBe(amount);
    });

    it('log all users in', async () => {
      for (const user of userSamples.samples) {
        const result = await userSamples.login(user);
        loginTokens.set(user.login, result.access);
      }
    });

    let post: PostViewModel;
    it('leave multiple likes under one post', async () => {
      post = samples.outputs[amount - 1];
      for (const pair of loginTokens) {
        await request(app.getHttpServer())
          .put(`/posts/${post.id}/like-status`)
          .set('Authorization', `Bearer ${pair[1]}`)
          .send({ likeStatus: 'Like' })
          .expect(204);
      }
    });
    it('check likesInfo for liked post', async () => {
      const result = await request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .expect(200);

      const info = (result.body as PostViewModel).extendedLikesInfo;
      expect(info.newestLikes.length).toBe(3);
      expect(result.body).toEqual({
        ...post,
        extendedLikesInfo: {
          likesCount: usersAmount,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: expect.any(Array),
        },
      });
    });
    it('check likesInfo on getMany', async () => {
      const result = await request(app.getHttpServer())
        .get(`/posts`)
        .set('Authorization', `Bearer ${[...loginTokens.values()][0]}`)
        .expect(200);

      const view = result.body as PageViewModel<PostViewModel>;

      for (const p of view.items) {
        if (p.id !== post.id) {
          expect(p.extendedLikesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          });
        } else {
          expect(p.extendedLikesInfo).toEqual({
            likesCount: usersAmount,
            dislikesCount: 0,
            myStatus: 'Like',
            newestLikes: expect.any(Array),
          });
        }
      }
    });
    it('change 2 likes to dislikes', async () => {
      for (let i = 0; i < 2; i++) {
        const login = [...loginTokens.keys()][0];
        await request(app.getHttpServer())
          .put(`/posts/${post.id}/like-status`)
          .set('Authorization', `Bearer ${loginTokens.get(login)}`)
          .send({ likeStatus: 'Dislike' })
          .expect(204);
        loginTokens.delete(login);
      }
    });
    it('check likesInfo after dislikes', async () => {
      const result = await request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .expect(200);

      const view = result.body as PostViewModel;
      expect(view.extendedLikesInfo.likesCount).toBe(usersAmount - 2);
      expect(view.extendedLikesInfo.dislikesCount).toBe(2);
      expect(view.extendedLikesInfo.newestLikes.length).toBe(usersAmount - 2);
    });

    let unlikedLogin: string;
    it('unlike by one user', async () => {
      unlikedLogin = [...loginTokens.keys()][0];
      await request(app.getHttpServer())
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${loginTokens.get(unlikedLogin)}`)
        .send({ likeStatus: 'None' })
        .expect(204);
    });

    it('count likes after unlike', async () => {
      const result = await request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${loginTokens.get(unlikedLogin)}`)
        .expect(200);
      const info = (result.body as PostViewModel).extendedLikesInfo;

      expect(info.dislikesCount + info.likesCount).toBe(usersAmount - 1);
    });
  });
});
