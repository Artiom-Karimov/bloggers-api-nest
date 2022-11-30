import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BlogUserBanMapper from './models/blog.user.ban.mapper';
import BlogUserBanModel from './models/blog.user.ban.model';
import BlogUserBan, {
  BlogUserBanDocument,
} from './models/blog.user.ban.schema';

@Injectable()
export default class BlogUserBanRepository {
  constructor(
    @InjectModel(BlogUserBan.name)
    private readonly model: Model<BlogUserBanDocument>,
  ) { }

  public async get(
    blogId: string,
    userId: string,
  ): Promise<BlogUserBanModel | undefined> {
    try {
      const result: BlogUserBan | null = await this.model.findOne({
        blogId,
        userId,
      });
      return result ? BlogUserBanMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(ban: BlogUserBanModel): Promise<string | undefined> {
    try {
      const newBan = new this.model(BlogUserBanMapper.fromDomain(ban));
      const result = await newBan.save();
      return result ? result._id : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async delete(blogId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.model.deleteOne({
        blogId,
        userId,
      });
      return result.acknowledged;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
