import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Comment, {
  CommentDocument,
} from '../../blogs/comments/mongoose/models/comment.schema';
import {
  CommentLike,
  LikeDocument,
  PostLike,
} from '../../blogs/likes/mongoose/models/like.schema';
import Post, {
  PostDocument,
} from '../../blogs/posts/mongoose/models/post.schema';
import TestRepository from '../test.repository';
import Blog, {
  BlogDocument,
} from '../../blogs/blogs/mongoose/models/blog.schema';

@Injectable()
export default class MongoTestRepository extends TestRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blog: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly post: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLike: Model<LikeDocument>,

    @InjectModel(Comment.name) private readonly comment: Model<CommentDocument>,
    @InjectModel(CommentLike.name)
    private readonly commentLike: Model<LikeDocument>,
  ) {
    super();
  }

  public async dropAll() {
    try {
      const promises = [
        this.commentLike.deleteMany({}),
        this.comment.deleteMany({}),
        this.postLike.deleteMany({}),
        this.post.deleteMany({}),
        this.blog.deleteMany({}),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  }
}
