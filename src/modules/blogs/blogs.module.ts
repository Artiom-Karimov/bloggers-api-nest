import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import BlogsController from './blogs/blogs.controller';
import BlogsQueryRepository from './blogs/blogs.query.repository';
import BlogsRepository from './blogs/blogs.repository';
import CommentsController from './comments/comments.controller';
import CommentsQueryRepository from './comments/comments.query.repository';
import CommentsRepository from './comments/comments.repository';
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
import { BlogIdValidator } from './blogs/models/input/blog.id.validator';
import Post, { PostSchema } from './posts/models/post.schema';
import PostsController from './posts/posts.controller';
import PostsQueryRepository from './posts/posts.query.repository';
import PostsRepository from './posts/posts.repository';
import { CreatePostHandler } from './posts/commands/handlers/create.post.handler';
import { UpdatePostHandler } from './posts/commands/handlers/update.post.handler';
import { DeletePostHandler } from './posts/commands/handlers/delete.post.handler';
import { PutPostLikeHandler } from './posts/commands/handlers/put.post.like.handler';
import { PutCommentLikeHandler } from './comments/commands/handlers/put.comment.like.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { BanBlogHandler } from './blogs/commands/handlers/ban.blog.handler';
import AdminBlogsQueryRepository from './blogs/admin.blogs.query.repository';
import BloggerCommentsQueryRepository from './comments/blogger.comments.query.repository';
import BlogUserBanRepository from './blogs/blog.user.ban.repository';
import BlogUserBan, {
  BlogUserBanSchema,
} from './blogs/models/blog.user.ban.schema';
import { CreateCommentHandler } from './comments/commands/handlers/create.comment.handler';
import BlogUserBanQueryRepository from './blogs/blog.user.ban.query.repository';
import { UsersModule } from '../users/users.module';
import { CreateBlogHandler } from './blogs/commands/handlers/create.blog.handler';
import { UpdateBlogHandler } from './blogs/commands/handlers/update.blog.handler';
import { DeleteBlogHandler } from './blogs/commands/handlers/delete.blog.handler';
import { BlogUserBanHandler } from './blogs/commands/handlers/blog.user.ban.handler';
import { UpdateCommentHandler } from './comments/commands/handlers/update.comment.handler';
import { DeleteCommentHandler } from './comments/commands/handlers/delete.comment.handler';

const commandHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  BanBlogHandler,
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  PutPostLikeHandler,
  CreateCommentHandler,
  UpdateCommentHandler,
  DeleteCommentHandler,
  PutCommentLikeHandler,
  BlogUserBanHandler,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    MongooseModule.forFeature([
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
    MongooseModule.forFeature([
      { name: BlogUserBan.name, schema: BlogUserBanSchema },
    ]),
    UsersModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    AdminBlogsQueryRepository,
    BlogUserBanRepository,
    BlogUserBanQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    PostLikesRepository,
    PostLikesQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    BloggerCommentsQueryRepository,
    CommentLikesRepository,
    CommentLikesQueryRepository,
    BlogIdValidator,
    ...commandHandlers,
  ],
  exports: [
    BlogsQueryRepository,
    BlogUserBanQueryRepository,
    AdminBlogsQueryRepository,
    PostsQueryRepository,
    PostLikesRepository,
    CommentsRepository,
    CommentLikesRepository,
    BloggerCommentsQueryRepository,
  ],
})
export class BlogsModule { }
