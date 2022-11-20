import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlogOwnerInfo } from './blog.model';

export type BlogDocument = Blog & Document;

@Schema()
export class BlogOwner {
  userId: string;
  userLogin: string;
}

@Schema({ collection: 'blogs' })
export default class Blog {
  constructor(
    _id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    ownerInfo?: BlogOwnerInfo,
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.ownerInfo = ownerInfo;
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
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
