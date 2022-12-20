import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CommentsRepository from '../interfaces/comments.repository';
import CommentMapper from './models/comment.mapper';
import CommentModel from '../models/comment.model';
import Comment, { CommentDocument } from './models/comment.schema';

@Injectable()
export default class MongoCommentsRepository extends CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
  ) {
    super();
  }
  public async get(id: string): Promise<CommentModel | undefined> {
    try {
      const result: Comment | null = await this.model.findById(id).exec();
      return result ? CommentMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(comment: CommentModel): Promise<string | undefined> {
    try {
      const newComment = new this.model(CommentMapper.fromDomain(comment));
      const result = await newComment.save();
      return result ? result._id : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(model: CommentModel): Promise<boolean> {
    try {
      const dbModel = CommentMapper.fromDomain(model);
      await this.model.findOneAndUpdate({ _id: dbModel._id }, dbModel).exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result: Comment | null = await this.model
        .findByIdAndDelete(id)
        .exec();
      return !!result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async banByAdmin(
    userId: string,
    bannedByAdmin: boolean,
  ): Promise<void> {
    try {
      await this.model.updateMany({ userId }, { bannedByAdmin }).exec();
    } catch (error) {
      console.error(error);
    }
  }
  public async banByBlogger(
    userId: string,
    blogId: string,
    bannedByBlogger: boolean,
  ): Promise<void> {
    try {
      await this.model
        .updateMany({ userId }, { bannedByBlogger })
        .populate({ path: 'postId', match: { blogId } });
    } catch (error) {
      console.error(error);
    }
  }
}
