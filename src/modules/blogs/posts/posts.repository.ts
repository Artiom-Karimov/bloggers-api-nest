import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PostMapper from '../posts/models/post.mapper';
import PostModel from '../posts/models/post.model';
import Post, { PostDocument } from '../posts/models/post.schema';

@Injectable()
export default class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<PostDocument>,
  ) { }

  public async get(id: string): Promise<PostModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? PostMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(post: PostModel): Promise<string | undefined> {
    try {
      const newPost = new this.model(PostMapper.fromDomain(post));
      const result = await newPost.save();
      return result ? result._id : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(id: string, data: Partial<Post>): Promise<boolean> {
    try {
      await this.model.findOneAndUpdate({ _id: id }, data).exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async setBlogBan(
    blogId: string,
    blogBanned: boolean,
  ): Promise<boolean> {
    try {
      await this.model.updateMany({ blogId }, { blogBanned });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
