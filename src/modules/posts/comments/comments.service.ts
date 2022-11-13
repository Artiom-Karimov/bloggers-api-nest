import { Injectable } from '@nestjs/common';
import CommentInputModel from '../models/comments/comment.input.model';
import CommentModel from '../models/comments/comment.model';
import CommentsRepository from './comments.repository';

export enum CommentError {
  NoError,
  NotFound,
  Forbidden,
  Unknown,
}

@Injectable()
export default class CommentsService {
  constructor(private readonly repo: CommentsRepository) { }

  public async create(data: CommentInputModel): Promise<CommentModel> {
    const comment = CommentModel.create(data);
    const created = await this.repo.create(comment);
    if (!created) return undefined;
    return this.repo.get(created);
  }
  public async update(
    id: string,
    data: CommentInputModel,
  ): Promise<CommentError> {
    const comment = await this.repo.get(id);
    if (!comment) return CommentError.NotFound;
    if (comment.userId !== data.userId) return CommentError.Forbidden;

    const updated = this.repo.update(id, data.content);
    return updated ? CommentError.NoError : CommentError.Unknown;
  }
  public async delete(id: string, userId: string): Promise<CommentError> {
    const comment = await this.repo.get(id);
    if (!comment) return CommentError.NotFound;
    if (comment.userId !== userId) return CommentError.Forbidden;

    const deleted = await this.repo.delete(id);
    return deleted ? CommentError.NoError : CommentError.Unknown;
  }
}
