import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import Post, { PostSchema } from '../posts/models/posts/post.schema';
import { PostsModule } from '../posts/posts.module';
import PostsQueryRepository from '../posts/posts.query.repository';
import PostsRepository from '../posts/posts.repository';
import PostsService from '../posts/posts.service';
import BlogsController from './blogs.controller';
import BlogsQueryRepository from './blogs.query.repository';
import BlogsRepository from './blogs.repository';
import BlogsService from './blogs.service';
import Blog, { BlogSchema } from './models/blog.schema';

describe('BlogsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        PostsModule,
      ],
      controllers: [BlogsController],
      providers: [
        BlogsRepository,
        BlogsQueryRepository,
        BlogsService,
        PostsRepository,
        PostsQueryRepository,
        PostsService,
      ],
    }).compile();
  });

  // describe('getHello', () => {
  //   it('should return "Hello World!"', () => {
  //     const appController = app.get(BlogsController);
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});
