import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Blog, { BlogDocument } from '../blogs/models/blog.schema';
import Comment, { CommentDocument } from '../comments/models/comment.schema';
import Post, { PostDocument } from '../posts/models/post.schema';
import User, { UserDocument } from '../users/models/user.schema';

@Injectable()
export default class TestRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) { }

  public dropAll = async () => {
    try {
      const promises = [
        this.blogModel.deleteMany({}),
        this.postModel.deleteMany({}),
        this.userModel.deleteMany({}),
        this.commentModel.deleteMany({}),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };
}
