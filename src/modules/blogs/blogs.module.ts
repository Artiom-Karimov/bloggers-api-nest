import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import BlogsController from './blogs/blogs.controller';
import BlogsQueryRepository from './blogs/interfaces/blogs.query.repository';
import BlogsRepository from './blogs/interfaces/blogs.repository';
import CommentsController from './comments/comments.controller';
import CommentsQueryRepository from './comments/interfaces/comments.query.repository';
import CommentsRepository from './comments/interfaces/comments.repository';
import CommentLikesRepository from './likes/interfaces/comment.likes.repository';
import PostLikesRepository from './likes/interfaces/post.likes.repository';
import Blog, { BlogSchema } from './blogs/mongoose/models/blog.schema';
import Comment, {
  CommentSchema,
} from './comments/mongoose/models/comment.schema';
import {
  CommentLike,
  CommentLikeSchema,
  PostLike,
  PostLikeSchema,
} from './likes/mongoose/models/like.schema';
import { BlogIdValidator } from './blogs/models/input/blog.id.validator';
import Post, { PostSchema } from './posts/mongoose/models/post.schema';
import PostsController from './posts/posts.controller';
import PostsQueryRepository from './posts/interfaces/posts.query.repository';
import PostsRepository from './posts/interfaces/posts.repository';
import { CreatePostHandler } from './posts/commands/handlers/create.post.handler';
import { UpdatePostHandler } from './posts/commands/handlers/update.post.handler';
import { DeletePostHandler } from './posts/commands/handlers/delete.post.handler';
import { PutPostLikeHandler } from './posts/commands/handlers/put.post.like.handler';
import { PutCommentLikeHandler } from './comments/commands/handlers/put.comment.like.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { BanBlogHandler } from './blogs/commands/handlers/ban.blog.handler';
import AdminBlogsQueryRepository from './blogs/interfaces/admin.blogs.query.repository';
import BloggerCommentsQueryRepository from './comments/interfaces/blogger.comments.query.repository';
import BlogUserBanRepository from './blogs/interfaces/blog.user.ban.repository';
import BlogUserBan, {
  BlogUserBanSchema,
} from './blogs/mongoose/models/blog.user.ban.schema';
import { CreateCommentHandler } from './comments/commands/handlers/create.comment.handler';
import BlogUserBanQueryRepository from './blogs/interfaces/blog.user.ban.query.repository';
import { UsersModule } from '../users/users.module';
import { CreateBlogHandler } from './blogs/commands/handlers/create.blog.handler';
import { UpdateBlogHandler } from './blogs/commands/handlers/update.blog.handler';
import { DeleteBlogHandler } from './blogs/commands/handlers/delete.blog.handler';
import { BlogUserBanHandler } from './blogs/commands/handlers/blog.user.ban.handler';
import { UpdateCommentHandler } from './comments/commands/handlers/update.comment.handler';
import { DeleteCommentHandler } from './comments/commands/handlers/delete.comment.handler';
import SqlBlogsRepository from './blogs/sql/sql.blogs.repository';
import SqlBlogsQueryRepository from './blogs/sql/sql.blogs.query.repository';
import SqlAdminBlogsQueryRepository from './blogs/sql/sql.admin.blogs.query.repository';
import SqlBlogUserBanRepository from './blogs/sql/sql.blog.user.ban.repository';
import SqlBlogUserBanQueryRepository from './blogs/sql/sql.blog.user.ban.query.repository';
import SqlPostsRepository from './posts/sql/sql.posts.repository';
import SqlPostsQueryRepository from './posts/sql/sql.posts.query.repository';
import SqlCommentsRepository from './comments/sql/sql.comments.repository';
import SqlCommentsQueryRepository from './comments/sql/sql.comments.query.repository';
import SqlBloggerCommentsQueryRepository from './comments/sql/sql.blogger.comments.query.repository';
import SqlPostLikesRepository from './likes/sql/sql.post.likes.repository';
import SqlCommentLikesRepository from './likes/sql/sql.comment.likes.repository';

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
    {
      provide: BlogsRepository,
      useClass: SqlBlogsRepository,
    },
    {
      provide: BlogsQueryRepository,
      useClass: SqlBlogsQueryRepository,
    },
    {
      provide: AdminBlogsQueryRepository,
      useClass: SqlAdminBlogsQueryRepository,
    },
    {
      provide: BlogUserBanRepository,
      useClass: SqlBlogUserBanRepository,
    },
    {
      provide: BlogUserBanQueryRepository,
      useClass: SqlBlogUserBanQueryRepository,
    },
    {
      provide: PostsRepository,
      useClass: SqlPostsRepository,
    },
    {
      provide: PostsQueryRepository,
      useClass: SqlPostsQueryRepository,
    },
    {
      provide: CommentsRepository,
      useClass: SqlCommentsRepository,
    },
    {
      provide: CommentsQueryRepository,
      useClass: SqlCommentsQueryRepository,
    },
    {
      provide: BloggerCommentsQueryRepository,
      useClass: SqlBloggerCommentsQueryRepository,
    },
    {
      provide: PostLikesRepository,
      useClass: SqlPostLikesRepository,
    },
    {
      provide: CommentLikesRepository,
      useClass: SqlCommentLikesRepository,
    },
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
