import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogUserBanDocument = BlogUserBan & Document;

@Schema({ collection: 'blog-user-bans' })
export default class BlogUserBan {
  constructor(
    _id: string,
    blogId: string,
    userId: string,
    userLogin: string,
    isBanned: boolean,
    banReason: string,
    banDate: string,
  ) {
    this._id = _id;
    this.blogId = blogId;
    this.userId = userId;
    this.userLogin = userLogin;
    this.isBanned = isBanned;
    this.banReason = banReason;
    this.banDate = banDate;
  }

  @Prop()
  _id: string;

  @Prop()
  blogId: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop()
  userLogin: string;

  @Prop()
  isBanned: boolean;

  @Prop()
  banReason: string;

  @Prop()
  banDate: string;
}

export const BlogUserBanSchema = SchemaFactory.createForClass(BlogUserBan);
