import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ collection: 'posts' })
export default class Post {
  constructor(
    _id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    blogBanned: boolean,
  ) {
    this._id = _id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = createdAt;
    this.blogBanned = blogBanned;
  }
  @Prop()
  _id: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop({ type: String, ref: 'Blog' })
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: string;

  @Prop()
  blogBanned: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
