import { Injectable } from '@nestjs/common';
import CommentsRepository from './comments.repository';
import CommentUpdateModel from './models/input/comment.update.model';

export enum CommentError {
  NoError,
  NotFound,
  Forbidden,
  Unknown,
}

@Injectable()
export default class CommentsService {
  constructor(private readonly repo: CommentsRepository) { }

  public async update(data: CommentUpdateModel): Promise<CommentError> {
    const comment = await this.repo.get(data.commentId);
    if (!comment) return CommentError.NotFound;
    if (comment.userId !== data.userId) return CommentError.Forbidden;

    const updated = this.repo.update(data.commentId, data.content);
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
