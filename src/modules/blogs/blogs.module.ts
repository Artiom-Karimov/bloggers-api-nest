import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PostLikesQueryRepository from '../posts/likes/post.likes.query.repository';
import PostLikesRepository from '../posts/likes/post.likes.repository';
import { PostLike, PostLikeSchema } from '../posts/models/likes/like.schema';
import Post, { PostSchema } from '../posts/models/posts/post.schema';
import PostsQueryRepository from '../posts/posts/posts.query.repository';
import PostsRepository from '../posts/posts/posts.repository';
import PostsService from '../posts/posts/posts.service';
import BlogsController from './blogs.controller';
import BlogsQueryRepository from './blogs.query.repository';
import BlogsRepository from './blogs.repository';
import BlogsService from './blogs.service';
import Blog, { BlogSchema } from './models/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsRepository,
    PostLikesRepository,
    PostsQueryRepository,
    PostLikesQueryRepository,
    PostsService,
  ],
})
export class BlogsModule { }
