import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Recovery, {
  RecoveryDocument,
} from '../../users/mongoose/models/recovery.schema';
import Session, {
  SessionDocument,
} from '../../users/mongoose/models/session.schema';
import Blog, { BlogDocument } from '../../blogs/blogs/mongoose/models/blog.schema';
import Comment, {
  CommentDocument,
} from '../../blogs/comments/mongoose/models/comment.schema';
import {
  CommentLike,
  LikeDocument,
  PostLike,
} from '../../blogs/likes/mongoose/models/like.schema';
import Post, { PostDocument } from '../../blogs/posts/mongoose/models/post.schema';
import UserBan, {
  UserBanDocument,
} from '../../users/mongoose/models/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationDocument,
} from '../../users/mongoose/models/email.confirmation.schema';
import User, { UserDocument } from '../../users/mongoose/models/user.schema';
import TestRepository from '../test.repository';

@Injectable()
export default class MongoTestRepository extends TestRepository {
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
  ) {
    super();
  }

  public async dropAll() {
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
  }
}
