import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PostsQueryRepository from '../posts/posts.query.repository';
import PostsService from '../posts/posts.service';
import BlogsController from './blogs.controller';
import BlogsQueryRepository from './blogs.query.repository';
import BlogsRepository from './blogs.repository';
import BlogsService from './blogs.service';
import Blog, { BlogSchema } from './models/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsService,
    PostsQueryRepository,
  ],
})
export class BlogsModule { }
