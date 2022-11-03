import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Blog, { BlogDocument } from '../blogs/models/blog.schema';
import Post, { PostDocument } from '../posts/models/post.schema';

@Injectable()
export default class TestRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) { }

  public dropAll = async () => {
    try {
      const promises = [
        this.blogModel.deleteMany({}),
        this.postModel.deleteMany({}),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };
}
