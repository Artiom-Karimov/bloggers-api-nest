import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = Like & Document;

export class Like {
  constructor(
    _id: string,
    entityId: string,
    userId: string,
    userLogin: string,
    status: string,
    lastModified: string,
  ) {
    this._id = _id;
    this.entityId = entityId;
    this.userId = userId;
    this.userLogin = userLogin;
    this.status = status;
    this.lastModified = lastModified;
  }

  @Prop()
  _id: string;

  @Prop()
  entityId: string;

  @Prop()
  userId: string;

  @Prop()
  userLogin: string;

  @Prop()
  status: string;

  @Prop()
  lastModified: string;
}

@Schema({ collection: 'post-likes' })
export class PostLike extends Like { }

@Schema({ collection: 'comment-likes' })
export class CommentLike extends Like { }

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
