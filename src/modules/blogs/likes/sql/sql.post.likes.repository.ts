import { Injectable } from '@nestjs/common';
import LikeModel from '../models/like.model';
import PostLikesRepository from '../interfaces/post.likes.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SqlLikesRepository from './sql.likes.rpository';

@Injectable()
export default class SqlPostLikesRepository extends PostLikesRepository {
  private readonly repo: SqlLikesRepository;

  constructor(@InjectDataSource() db: DataSource) {
    super();
    this.repo = new SqlLikesRepository(db, 'post');
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
