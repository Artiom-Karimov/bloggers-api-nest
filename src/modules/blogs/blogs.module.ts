import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Post, { PostSchema } from '../posts/models/posts/post.schema';
import PostsQueryRepository from '../posts/posts.query.repository';
import PostsRepository from '../posts/posts.repository';
import PostsService from '../posts/posts.service';
import BlogsController from './blogs.controller';
import BlogsQueryRepository from './blogs.query.repository';
import BlogsRepository from './blogs.repository';
import BlogsService from './blogs.service';
import Blog, { BlogSchema } from './models/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
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
})
export class BlogsModule { }
