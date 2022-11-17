import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostLike, PostLikeSchema } from '../posts/models/likes/like.schema';
import Post, { PostSchema } from '../posts/models/posts/post.schema';
import { PostsModule } from '../posts/posts.module';
import BlogsController from './blogs.controller';
import BlogsQueryRepository from './blogs.query.repository';
import BlogsRepository from './blogs.repository';
import BlogsService from './blogs.service';
import Blog, { BlogSchema } from './models/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    PostsModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsRepository, BlogsQueryRepository, BlogsService],
})
export class BlogsModule { }
