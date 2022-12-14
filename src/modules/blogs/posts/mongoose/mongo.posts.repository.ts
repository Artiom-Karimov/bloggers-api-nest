import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PostMapper from './models/post.mapper';
import PostModel from '../models/post.model';
import Post, { PostDocument } from './models/post.schema';
import PostsRepository from '../interfaces/posts.repository';

@Injectable()
export default class MongoPostsRepository extends PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<PostDocument>,
  ) {
    super();
  }

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
  public async update(model: PostModel): Promise<boolean> {
    try {
      const dbModel = PostMapper.fromDomain(model);
      await this.model.findOneAndUpdate({ _id: model.id }, dbModel).exec();
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
