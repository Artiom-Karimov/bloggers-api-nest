import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Blog, { BlogSchema } from '../blogs/models/blog.schema';
import CommentsQueryRepository from '../comments/comments.query.repository';
import Comment, { CommentSchema } from '../comments/models/comment.schema';
import Post, { PostSchema } from './models/post.schema';
import PostsController from './posts.controller';
import PostsQueryRepository from './posts.query.repository';
import PostsRepository from './posts.repository';
import PostsService from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    CommentsQueryRepository,
  ],
})
export class PostsModule { }
