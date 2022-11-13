import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Blog, { BlogSchema } from '../blogs/models/blog.schema';
import CommentsController from './comments/comments.controller';
import CommentsQueryRepository from './comments/comments.query.repository';
import CommentsRepository from './comments/comments.repository';
import Comment, { CommentSchema } from './models/comments/comment.schema';
import Post, { PostSchema } from './models/posts/post.schema';
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
  controllers: [PostsController, CommentsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
})
export class PostsModule { }
