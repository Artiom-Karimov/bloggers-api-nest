import { Injectable } from '@nestjs/common';
import CommentLikesRepository from '../likes/comment.likes.repository';
import CommentModel from '../comments/models/comment.model';
import CommentsRepository from './comments.repository';
import CommentCreateModel from './models/comment.create.model';
import CommentUpdateModel from './models/comment.update.model';

export enum CommentError {
  NoError,
  NotFound,
  Forbidden,
  Unknown,
}

@Injectable()
export default class CommentsService {
  constructor(
    private readonly repo: CommentsRepository,
    private readonly likeRepo: CommentLikesRepository,
  ) { }

  public async create(data: CommentCreateModel): Promise<string> {
    const comment = CommentModel.create(data);
    const created = await this.repo.create(comment);
    return created ?? undefined;
  }
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
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    await this.repo.setUserBanned(userId, userBanned);
    await this.likeRepo.setUserBanned(userId, userBanned);
  }
}
