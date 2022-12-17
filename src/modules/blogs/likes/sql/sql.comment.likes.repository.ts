import { Injectable } from '@nestjs/common';
import LikeModel from '../models/like.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SqlLikesRepository from './sql.likes.rpository';
import CommentLikesRepository from '../interfaces/comment.likes.repository';

@Injectable()
export default class SqlCommentLikesRepository extends CommentLikesRepository {
  private readonly repo: SqlLikesRepository;

  constructor(@InjectDataSource() db: DataSource) {
    super();
    this.repo = new SqlLikesRepository(db, 'comment');
  }

  public async get(entityId: string, userId: string): Promise<LikeModel> {
    return this.repo.get(entityId, userId);
  }
  public async create(data: LikeModel): Promise<boolean> {
    return this.repo.create(data);
  }
  public async update(data: LikeModel): Promise<boolean> {
    return this.repo.update(data);
  }
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    return this.repo.setUserBanned(userId, userBanned);
  }
}
