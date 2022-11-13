import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ collection: 'post-likes' })
export default class Like {
  @Prop()
  _id: string;

  @Prop()
  entityId: string;

  @Prop()
  userId: string;

  @Prop()
  status: string;

  @Prop()
  lastModified: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
