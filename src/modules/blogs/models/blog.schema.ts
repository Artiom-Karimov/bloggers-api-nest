import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ collection: 'blogs' })
export default class Blog {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  youtubeUrl: string;

  @Prop()
  createdAt: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
