import { Module } from '@nestjs/common';
import BlogsController from './blogs/blogs.controller';
import BlogsQueryRepository from './blogs/interfaces/blogs.query.repository';
import BlogsRepository from './blogs/interfaces/blogs.repository';
import CommentsController from './comments/comments.controller';
import CommentsQueryRepository from './comments/interfaces/comments.query.repository';
import CommentsRepository from './comments/interfaces/comments.repository';
import { BlogIdValidator } from './blogs/models/input/blog.id.validator';
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
import { CreateCommentHandler } from './comments/commands/handlers/create.comment.handler';
import BlogUserBanQueryRepository from './blogs/interfaces/blog.user.ban.query.repository';
import { UsersModule } from '../users/users.module';
import { CreateBlogHandler } from './blogs/commands/handlers/create.blog.handler';
import { UpdateBlogHandler } from './blogs/commands/handlers/update.blog.handler';
import { DeleteBlogHandler } from './blogs/commands/handlers/delete.blog.handler';
import { BlogUserBanHandler } from './blogs/commands/handlers/blog.user.ban.handler';
import { UpdateCommentHandler } from './comments/commands/handlers/update.comment.handler';
import { DeleteCommentHandler } from './comments/commands/handlers/delete.comment.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/typeorm/models/blog';
import { BlogBan } from './blogs/typeorm/models/blog.ban';
import { BlogUserBan } from './blogs/typeorm/models/blog.user.ban';
import { Post } from './posts/typeorm/models/post';
import { Comment } from './comments/typeorm/models/comment';
import { PostLike } from './likes/typeorm/models/post.like';
import { CommentLike } from './likes/typeorm/models/comment.like';
import { OrmBlogsRepository } from './blogs/typeorm/orm.blogs.repository';
import { OrmBlogsQueryRepository } from './blogs/typeorm/orm.blogs.query.repository';
import { OrmAdminBlogsQueryRepository } from './blogs/typeorm/orm.admin.blogs.query.repository';
import { OrmBlogUserBanRepository } from './blogs/typeorm/orm.blog.user.ban.repository';
import { OrmBlogUserBanQueryRepository } from './blogs/typeorm/orm.blog.user.ban.query.repository';
import { OrmPostsRepository } from './posts/typeorm/orm.posts.repository';
import { OrmPostsQueryRepository } from './posts/typeorm/orm.posts.query.repository';
import { OrmCommentsRepository } from './comments/typeorm/orm.comments.repository';
import { OrmCommentsQueryRepository } from './comments/typeorm/orm.comments.query.reository';
import { OrmBloggerCommentsQueryRepository } from './comments/typeorm/orm.blogger.comments.query.repository';

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
    TypeOrmModule.forFeature([Blog]),
    TypeOrmModule.forFeature([BlogBan]),
    TypeOrmModule.forFeature([BlogUserBan]),
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([PostLike]),
    TypeOrmModule.forFeature([CommentLike]),
    CqrsModule,
    UsersModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    {
      provide: BlogsRepository,
      useClass: OrmBlogsRepository,
    },
    {
      provide: BlogsQueryRepository,
      useClass: OrmBlogsQueryRepository,
    },
    {
      provide: AdminBlogsQueryRepository,
      useClass: OrmAdminBlogsQueryRepository,
    },
    {
      provide: BlogUserBanRepository,
      useClass: OrmBlogUserBanRepository,
    },
    {
      provide: BlogUserBanQueryRepository,
      useClass: OrmBlogUserBanQueryRepository,
    },
    {
      provide: PostsRepository,
      useClass: OrmPostsRepository,
    },
    {
      provide: PostsQueryRepository,
      useClass: OrmPostsQueryRepository,
    },
    {
      provide: CommentsRepository,
      useClass: OrmCommentsRepository,
    },
    {
      provide: CommentsQueryRepository,
      useClass: OrmCommentsQueryRepository,
    },
    {
      provide: BloggerCommentsQueryRepository,
      useClass: OrmBloggerCommentsQueryRepository,
    },
    BlogIdValidator,
    ...commandHandlers,
  ],
  exports: [
    BlogsQueryRepository,
    BlogUserBanQueryRepository,
    AdminBlogsQueryRepository,
    PostsQueryRepository,
    CommentsRepository,
    BloggerCommentsQueryRepository,
  ],
})
export class BlogsModule { }
