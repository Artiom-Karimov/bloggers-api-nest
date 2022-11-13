import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CommentMapper from '../models/comments/comment.mapper';
import CommentModel from '../models/comments/comment.model';
import Comment, { CommentDocument } from '../models/comments/comment.schema';

@Injectable()
export default class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
  ) { }
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
  public async update(id: string, content: string): Promise<boolean> {
    try {
      await this.model.findOneAndUpdate({ _id: id }, { content }).exec();
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
}
