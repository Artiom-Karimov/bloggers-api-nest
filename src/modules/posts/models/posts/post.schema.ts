import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ collection: 'posts' })
export default class Post {
  @Prop()
  _id: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
