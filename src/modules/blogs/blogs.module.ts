import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import BlogsController from './blogs/blogs.controller';
import BlogsQueryRepository from './blogs/blogs.query.repository';
import BlogsRepository from './blogs/blogs.repository';
import BlogsService from './blogs/blogs.service';
import CommentsController from './comments/comments.controller';
import CommentsQueryRepository from './comments/comments.query.repository';
import CommentsRepository from './comments/comments.repository';
import CommentsService from './comments/comments.service';
import CommentLikesQueryRepository from './likes/comment.likes.query.repository';
import CommentLikesRepository from './likes/comment.likes.repository';
import PostLikesQueryRepository from './likes/post.likes.query.repository';
import PostLikesRepository from './likes/post.likes.repository';
import Blog, { BlogSchema } from './blogs/models/blog.schema';
import Comment, { CommentSchema } from './comments/models/comment.schema';
import {
  CommentLike,
  CommentLikeSchema,
  PostLike,
  PostLikeSchema,
} from './likes/models/like.schema';
import { BlogIdValidator } from './posts/models/blog.id.validator';
import Post, { PostSchema } from './posts/models/post.schema';
import PostsController from './posts/posts.controller';
import PostsQueryRepository from './posts/posts.query.repository';
import PostsRepository from './posts/posts.repository';
import PostsService from './posts/posts.service';
import { CreateBlogHandler } from './blogs/commands/create.blog.handler';
import { UpdateBlogHandler } from './blogs/commands/update.blog.handler';
import { DeleteBlogHandler } from './blogs/commands/delete.blog.handler';
import { CreatePostHandler } from './posts/commands/create.post.handler';
import { UpdatePostHandler } from './posts/commands/update.post.handler';
import { DeletePostHandler } from './posts/commands/delete.post.handler';

const commandHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    MongooseModule.forFeature([
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
    AuthModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,
    PostsRepository,
    PostsQueryRepository,
    PostLikesRepository,
    PostLikesQueryRepository,
    PostsService,
    CommentsRepository,
    CommentsQueryRepository,
    CommentLikesRepository,
    CommentLikesQueryRepository,
    CommentsService,
    BlogIdValidator,
    ...commandHandlers,
  ],
  exports: [
    BlogsService,
    BlogsQueryRepository,
    PostsService,
    PostsQueryRepository,
    CommentsService,
  ],
})
export class BlogsModule { }
