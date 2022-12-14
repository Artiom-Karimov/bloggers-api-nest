import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema()
export class BlogOwner {
  userId?: string;
  userLogin?: string;
}
@Schema()
export class BlogBan {
  isBanned?: boolean;
  banDate?: string;
}

@Schema({ collection: 'blogs' })
export default class Blog {
  constructor(
    _id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    ownerInfo?: BlogOwner,
    banInfo?: BlogBan,
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.ownerInfo = ownerInfo;
    this.banInfo = banInfo;
  }
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  createdAt: string;

  @Prop()
  ownerInfo?: BlogOwner;

  @Prop()
  banInfo?: BlogBan;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
