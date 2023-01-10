import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import BlogSampleGenerator from './utils/blog.sample.generator';
import * as config from '../src/config/admin';
import UserSampleGenerator from './utils/user.sample.generator';
import BlogViewModel from '../src/modules/blogs/blogs/models/view/blog.view.model';
import PageViewModel from '../src/common/models/page.view.model';
import PostViewModel from '../src/modules/blogs/posts/models/post.view.model';
import UserViewModel from '../src/modules/users/models/view/user.view.model';
import { regex } from '../src/common/utils/validation.regex';

jest.useRealTimers();

describe('AdminController (e2e)', () => {
  const blogBase = '/sa/blogs';
  const userBase = '/sa/users';
  let app: INestApplication;
  let blogSamples: BlogSampleGenerator;
  let userSamples: UserSampleGenerator;

  const emptyPage = {
    pagesCount: 0,
    page: 1,
    pageSize: expect.any(Number),
    totalCount: 0,
    items: [],
  };

  beforeAll(async () => {
    app = await init();
    blogSamples = new BlogSampleGenerator(app);
    userSamples = new UserSampleGenerator(app);
    await request(app.getHttpServer()).delete('/testing/all-data');
  }, 10000);
  afterAll(async () => {
    await stop();
  });

  describe('admin unauthorized', () => {
    it('unauthorized if no auth', async () => {
      const noAuth = [
        request(app.getHttpServer()).get(blogBase),
        request(app.getHttpServer()).get(userBase),
        request(app.getHttpServer()).post(userBase).send('poop!'),
        request(app.getHttpServer())
          .put(`${userBase}/qweruio/ban`)
          .send('poop!'),
        request(app.getHttpServer()).delete(`${userBase}/qwerui`),
      ];
      const noAuthResults = await Promise.all(noAuth);
      for (const res of noAuthResults) {
        expect(res.statusCode).toBe(401);
      }
    });
    it('unauthorized if wrong credentials', async () => {
      const noAuth = [
        request(app.getHttpServer()).get(blogBase),
        request(app.getHttpServer())
          .get(userBase)
          .auth(config.userName, 'hell-o'),
        request(app.getHttpServer())
          .post(userBase)
          .send('poop!')
          .auth('userName', 'hell-o'),
        request(app.getHttpServer())
          .put(`${userBase}/qweruio/ban`)
          .send('poop!')
          .auth('letMeIn', config.password),
        request(app.getHttpServer()).delete(`${userBase}/qwerui`).auth('', ''),
      ];
      const noAuthResults = await Promise.all(noAuth);
      for (const res of noAuthResults) {
        expect(res.statusCode).toBe(401);
      }
    });
  });

  describe('admin blog operations', () => {
    it('should get empty blogs', async () => {
      const response = await request(app.getHttpServer())
        .get(blogBase)
        .auth(config.userName, config.password);
      expect(response.body).toEqual(emptyPage);
    });

    const amount = 2;
    it('should get created blogs', async () => {
      blogSamples.generateSamples(amount);
      await blogSamples.createSamples();

      const response = await request(app.getHttpServer())
        .get(blogBase)
        .auth(config.userName, config.password);

      const expectedPage = {
        pagesCount: 1,
        page: 1,
        pageSize: expect.any(Number),
        totalCount: amount,
        items: expect.arrayContaining([
          {
            id: expect.any(String),
            name: blogSamples.samples[0].name,
            description: blogSamples.samples[0].description,
            websiteUrl: blogSamples.samples[0].websiteUrl,
            createdAt: expect.stringMatching(regex.isoDate),
            blogOwnerInfo: {
              userId: expect.any(String),
              userLogin: blogSamples.user.login,
            },
            banInfo: {
              isBanned: false,
              banDate: null,
            },
          },
          {
            id: expect.any(String),
            name: blogSamples.samples[1].name,
            description: blogSamples.samples[1].description,
            websiteUrl: blogSamples.samples[1].websiteUrl,
            createdAt: expect.stringMatching(regex.isoDate),
            blogOwnerInfo: {
              userId: expect.any(String),
              userLogin: blogSamples.user.login,
            },
            banInfo: {
              isBanned: false,
              banDate: null,
            },
          },
        ]),
      };

      expect(response.body).toEqual(expectedPage);
    });

    let bannedBlog: BlogViewModel;
    let bannedPost: PostViewModel;
    it('add a post to check blog ban', async () => {
      bannedBlog = blogSamples.outputs[0];
      const response = await request(app.getHttpServer())
        .post(`/blogger/blogs/${bannedBlog.id}/posts`)
        .set('Authorization', `Bearer ${blogSamples.tokens.access}`)
        .send({
          title: 'samplePost',
          shortDescription: 'describe this!',
          content: 'The best text piece in the whole world',
        })
        .expect(201);
      bannedPost = response.body;
    });
    it('should ban a blog', async () => {
      await request(app.getHttpServer())
        .put(`${blogBase}/${bannedBlog.id}/ban`)
        .auth(config.userName, config.password)
        .send({ isBanned: true })
        .expect(204);
    });
    it('user should not get banned blog', async () => {
      await request(app.getHttpServer())
        .get(`/blogs/${bannedBlog.id}`)
        .expect(404);

      const retrieved = await request(app.getHttpServer())
        .get(`/blogs`)
        .expect(200);
      const body = retrieved.body as PageViewModel<BlogViewModel>;
      expect(body.totalCount).toBe(amount - 1);
      expect(body.items.length).toBe(amount - 1);
    });
    it('user should not get banned blog posts', async () => {
      await request(app.getHttpServer())
        .get(`/blogs/${bannedBlog.id}/posts`)
        .expect(404);
      await request(app.getHttpServer())
        .get(`/posts/${bannedPost.id}`)
        .expect(404);
    });
    it('blogger should not create post for banned blog', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogger/blogs/${bannedBlog.id}/posts`)
        .set('Authorization', `Bearer ${blogSamples.tokens.access}`)
        .send({
          title: 'sampl756ePost',
          shortDescription: 'describe this!',
          content: 'The best text piece in the whole world',
        });
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
    it('admin should get banned blog', async () => {
      const response = await request(app.getHttpServer())
        .get(blogBase)
        .auth(config.userName, config.password)
        .expect(200);

      const expectedPage = {
        pagesCount: 1,
        page: 1,
        pageSize: expect.any(Number),
        totalCount: amount,
        items: expect.arrayContaining([
          {
            id: bannedBlog.id,
            name: bannedBlog.name,
            description: bannedBlog.description,
            websiteUrl: bannedBlog.websiteUrl,
            createdAt: expect.stringMatching(regex.isoDate),
            blogOwnerInfo: {
              userId: expect.any(String),
              userLogin: blogSamples.user.login,
            },
            banInfo: {
              isBanned: true,
              banDate: expect.stringMatching(regex.isoDate),
            },
          },
        ]),
      };
      expect(response.body).toEqual(expectedPage);
    });
    it('should unban blog', async () => {
      await request(app.getHttpServer())
        .put(`${blogBase}/${bannedBlog.id}/ban`)
        .auth(config.userName, config.password)
        .send({ isBanned: false })
        .expect(204);
    });
    it('user should get unbanned blog', async () => {
      await request(app.getHttpServer())
        .get(`/blogs/${bannedBlog.id}`)
        .expect(200);
    });
    it('user should get unbanned blog posts', async () => {
      await request(app.getHttpServer())
        .get(`/blogs/${bannedBlog.id}/posts`)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/posts/${bannedPost.id}`)
        .expect(200);
    });
  });

  describe('admin user operations', () => {
    it('should create user', async () => {
      const sample = userSamples.generateSamples(1)[0];
      await userSamples.createSamples();
      expect(userSamples.outputs.length).toBe(1);

      const expected = {
        id: expect.any(String),
        login: sample.login,
        email: sample.email,
        createdAt: expect.stringMatching(regex.isoDate),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      };
      expect(userSamples.outputs[0]).toEqual(expected);
    });
    it('should ban user', async () => {
      const user = userSamples.outputs[0];
      const response = await request(app.getHttpServer())
        .put(`${userBase}/${user.id}/ban`)
        .auth(config.userName, config.password)
        .send({
          isBanned: true,
          banReason: 'Do not ask, he is just an asshole.',
        });
      expect(response.statusCode).toBe(204);
    });
    it('should get user ban info', async () => {
      const user = userSamples.outputs[0];
      const response = await request(app.getHttpServer())
        .get(`${userBase}/${user.id}`)
        .auth(config.userName, config.password);

      const expected = {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: expect.stringMatching(regex.isoDate),
        banInfo: {
          isBanned: true,
          banDate: expect.stringMatching(regex.isoDate),
          banReason: expect.any(String),
        },
      };
      expect(response.body).toEqual(expected);
    });
    it('banned user should not login', async () => {
      const user = userSamples.samples[0];
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: user.login, password: user.password });
      expect(response.statusCode).toBe(401);
    });
    it('should unban user', async () => {
      const user = userSamples.outputs[0];
      const response = await request(app.getHttpServer())
        .put(`${userBase}/${user.id}/ban`)
        .auth(config.userName, config.password)
        .send({
          isBanned: false,
          banReason: 'Do not ask, he is just an asshole.',
        });
      expect(response.statusCode).toBe(204);
    });
    it('should get unbanned user', async () => {
      const user = userSamples.outputs[0];
      const response = await request(app.getHttpServer())
        .get(`${userBase}/${user.id}`)
        .auth(config.userName, config.password);

      const expected = {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: expect.stringMatching(regex.isoDate),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      };
      expect(response.body).toEqual(expected);
    });
    it('should delete user', async () => {
      const user = userSamples.outputs[0];
      let response = await request(app.getHttpServer())
        .delete(`${userBase}/${user.id}`)
        .auth(config.userName, config.password);
      expect(response.statusCode).toBe(204);

      response = await request(app.getHttpServer())
        .get(`${userBase}/${user.id}`)
        .auth(config.userName, config.password);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('admin multiple users operations', () => {
    beforeAll(async () => {
      await request(app.getHttpServer()).delete('/testing/all-data');
      userSamples = new UserSampleGenerator(app);
    });

    const amount = 12;
    it('should create users', async () => {
      userSamples.generateSamples(amount);
      await userSamples.createSamples();
      expect(userSamples.outputs.length).toBe(amount);

      for (const u of userSamples.outputs) {
        const expected = {
          id: expect.any(String),
          login: expect.any(String),
          email: expect.any(String),
          createdAt: expect.stringMatching(regex.isoDate),
          banInfo: {
            isBanned: false,
            banDate: null,
            banReason: null,
          },
        };
        expect(u).toEqual(expected);
      }
      for (const s of userSamples.samples) {
        const exists = userSamples.outputs.some((o) => {
          return o.login === s.login && o.email === s.email;
        });
        expect(exists).toBe(true);
      }
    });

    it('should get users with pagination', async () => {
      userSamples.outputs.sort((a, b) => {
        return a.login.localeCompare(b.login);
      });

      const result = await request(app.getHttpServer())
        .get(
          `${userBase}?pageSize=15&pageNumber=1&searchLoginTerm=you&searchEmailTerm=.com&sortDirection=asc&sortBy=login`,
        )
        .auth(config.userName, config.password)
        .expect(200);

      const body = result.body as PageViewModel<UserViewModel>;
      expect(body).toEqual(
        new PageViewModel<UserViewModel>(1, 15, amount).add(
          ...userSamples.outputs,
        ),
      );
    });

    it('should get users with pagination', async () => {
      userSamples.outputs.sort((a, b) => {
        return b.createdAt.localeCompare(a.createdAt);
      });

      const firstPageResult = await request(app.getHttpServer())
        .get(`${userBase}?pageSize=3`)
        .auth(config.userName, config.password)
        .expect(200);

      const body = firstPageResult.body as PageViewModel<UserViewModel>;
      expect(body).toEqual(
        new PageViewModel<UserViewModel>(1, 3, amount).add(
          ...userSamples.outputs.slice(0, 3),
        ),
      );
    });
    it('should get users with pagination', async () => {
      const thirdPageResult = await request(app.getHttpServer())
        .get(`${userBase}?pageSize=3&pageNumber=3`)
        .auth(config.userName, config.password)
        .expect(200);

      const body = thirdPageResult.body as PageViewModel<UserViewModel>;
      expect(body).toEqual(
        new PageViewModel<UserViewModel>(3, 3, amount).add(
          ...userSamples.outputs.slice(6, 9),
        ),
      );
    });
  });
});
