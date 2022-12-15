import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ collection: 'comments' })
export default class Comment {
  constructor(
    _id: string,
    postId: string,
    userId: string,
    userLogin: string,
    bannedByAdmin: boolean,
    bannedByBlogger: boolean,
    content: string,
    createdAt: string,
  ) {
    this._id = _id;
    this.postId = postId;
    this.userId = userId;
    this.userLogin = userLogin;
    this.bannedByAdmin = bannedByAdmin;
    this.bannedByBlogger = bannedByBlogger;
    this.content = content;
    this.createdAt = createdAt;
  }
  @Prop()
  _id: string;

  @Prop({ type: String, ref: 'Post' })
  postId: string;

  @Prop()
  userId: string;

  @Prop()
  userLogin: string;

  @Prop()
  bannedByAdmin: boolean;

  @Prop()
  bannedByBlogger: boolean;

  @Prop()
  content: string;

  @Prop()
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
