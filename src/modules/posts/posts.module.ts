import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Blog, { BlogSchema } from '../blogs/models/blog.schema';
import CommentsController from './comments/comments.controller';
import CommentsQueryRepository from './comments/comments.query.repository';
import CommentsRepository from './comments/comments.repository';
import CommentsService from './comments/comments.service';
import Comment, { CommentSchema } from './models/comments/comment.schema';
import {
  CommentLike,
  CommentLikeSchema,
  PostLike,
  PostLikeSchema,
} from './models/likes/like.schema';
import Post, { PostSchema } from './models/posts/post.schema';
import PostsController from './posts/posts.controller';
import PostsQueryRepository from './posts/posts.query.repository';
import PostsRepository from './posts/posts.repository';
import PostsService from './posts/posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    MongooseModule.forFeature([
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
  ],
  controllers: [PostsController, CommentsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    CommentsRepository,
    CommentsQueryRepository,
    CommentsService,
  ],
})
export class PostsModule { }
