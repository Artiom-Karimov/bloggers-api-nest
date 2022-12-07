import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Recovery, {
  RecoverySchema,
} from '../auth/models/recovery/recovery.schema';
import Session, { SessionSchema } from '../users/mongoose/models/session.schema';
import Blog, { BlogSchema } from '../blogs/blogs/models/blog.schema';
import Comment, {
  CommentSchema,
} from '../blogs/comments/models/comment.schema';
import {
  CommentLike,
  CommentLikeSchema,
  PostLike,
  PostLikeSchema,
} from '../blogs/likes/models/like.schema';
import Post, { PostSchema } from '../blogs/posts/models/post.schema';
import UserBan, { UserBanSchema } from '../users/mongoose/models/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationSchema,
} from '../users/mongoose/models/email.confirmation.schema';
import User, { UserSchema } from '../users/mongoose/models/user.schema';
import TestController from './test.controller';
import TestRepository from './test.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestRepository],
})
export class TestModule { }
