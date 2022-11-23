import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Recovery, {
  RecoveryDocument,
} from '../auth/models/recovery/recovery.schema';
import Session, {
  SessionDocument,
} from '../auth/models/session/session.schema';
import Blog, { BlogDocument } from '../posts/models/blogs/blog.schema';
import Comment, {
  CommentDocument,
} from '../posts/models/comments/comment.schema';
import {
  CommentLike,
  LikeDocument,
  PostLike,
} from '../posts/models/likes/like.schema';
import Post, { PostDocument } from '../posts/models/posts/post.schema';
import UserBan, { UserBanDocument } from '../users/models/ban/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationDocument,
} from '../users/models/email/email.confirmation.schema';
import User, { UserDocument } from '../users/models/user.schema';

@Injectable()
export default class TestRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blog: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly post: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLike: Model<LikeDocument>,

    @InjectModel(Comment.name) private readonly comment: Model<CommentDocument>,
    @InjectModel(CommentLike.name)
    private readonly commentLike: Model<LikeDocument>,

    @InjectModel(User.name) private readonly user: Model<UserDocument>,
    @InjectModel(EmailConfirmation.name)
    private readonly emailConfirmation: Model<EmailConfirmationDocument>,
    @InjectModel(Session.name) private readonly session: Model<SessionDocument>,
    @InjectModel(UserBan.name) private readonly userBan: Model<UserBanDocument>,
    @InjectModel(Recovery.name)
    private readonly recovery: Model<RecoveryDocument>,
  ) { }

  public dropAll = async () => {
    try {
      const promises = [
        this.commentLike.deleteMany({}),
        this.comment.deleteMany({}),
        this.postLike.deleteMany({}),
        this.post.deleteMany({}),
        this.blog.deleteMany({}),

        this.session.deleteMany({}),
        this.recovery.deleteMany({}),
        this.userBan.deleteMany({}),
        this.emailConfirmation.deleteMany({}),
        this.user.deleteMany({}),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };
}
