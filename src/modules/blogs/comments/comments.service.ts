import { Injectable } from '@nestjs/common';
import CommentLikesRepository from '../likes/comment.likes.repository';
import CommentInputModel from './models/comment.input.model';
import CommentModel from '../comments/models/comment.model';
import LikeInputModel from '../likes/models/like.input.model';
import LikeModel from '../likes/models/like.model';
import CommentsRepository from './comments.repository';

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

  public async create(data: CommentInputModel): Promise<string> {
    const comment = CommentModel.create(data);
    const created = await this.repo.create(comment);
    return created ?? undefined;
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
  public async putLike(data: LikeInputModel): Promise<boolean> {
    const comment = await this.repo.get(data.entityId);
    if (!comment) return false;

    let like = await this.likeRepo.get(data.entityId, data.userId);
    if (like) {
      like = LikeModel.update(like, data.likeStatus);
      return this.likeRepo.update(like);
    }
    like = LikeModel.create(data);
    return this.likeRepo.create(like);
  }
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    await this.repo.setUserBanned(userId, userBanned);
    await this.likeRepo.setUserBanned(userId, userBanned);
  }
}
