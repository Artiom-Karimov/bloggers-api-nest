import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BlogMapper from './models/blog.mapper';
import BlogModel from './models/blog.model';
import Blog, { BlogDocument } from './models/blog.schema';

@Injectable()
export default class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogs: Model<BlogDocument>,
  ) { }

  public async get(id: string): Promise<BlogModel | undefined> {
    try {
      const result: Blog | null = await this.blogs.findById(id).exec();
      return result ? BlogMapper.toDomain(result) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  public async create(blog: BlogModel): Promise<string | undefined> {
    try {
      const newBlog = new this.blogs(BlogMapper.fromDomain(blog));
      const result = await newBlog.save();
      return result ? result._id : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  public async update(id: string, data: Partial<Blog>): Promise<boolean> {
    try {
      await this.blogs.findOneAndUpdate({ _id: id }, data).exec();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result: Blog | null = await this.blogs.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
