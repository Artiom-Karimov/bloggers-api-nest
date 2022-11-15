import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ collection: 'comments' })
export default class Comment {
  @Prop()
  _id: string;

  @Prop()
  postId: string;

  @Prop()
  userId: string;

  @Prop()
  userLogin: string;

  @Prop()
  userBanned: boolean;

  @Prop()
  content: string;

  @Prop()
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
