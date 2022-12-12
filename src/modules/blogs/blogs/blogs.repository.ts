import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BlogMapper from '../blogs/models/blog.mapper';
import BlogModel from '../blogs/models/blog.model';
import Blog, { BlogDocument } from '../blogs/models/blog.schema';

@Injectable()
export default class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly model: Model<BlogDocument>,
  ) { }

  public async get(id: string): Promise<BlogModel | undefined> {
    try {
      const result: Blog | null = await this.model.findById(id).exec();
      return result ? BlogMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(blog: BlogModel): Promise<string | undefined> {
    try {
      const newBlog = new this.model(BlogMapper.fromDomain(blog));
      const result = await newBlog.save();
      return result ? result._id : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(model: BlogModel): Promise<boolean> {
    try {
      const dbBlog = new this.model(BlogMapper.fromDomain(model));
      await this.model.findOneAndUpdate({ _id: dbBlog._id }, dbBlog).exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result: Blog | null = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
