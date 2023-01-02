import { Injectable } from '@nestjs/common';
import PostLikesRepository from '../interfaces/post.likes.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SqlLikesRepository from './sql.likes.rpository';
import { Like } from '../typeorm/models/like';

@Injectable()
export default class SqlPostLikesRepository extends PostLikesRepository {
  private readonly repo: SqlLikesRepository;

  constructor(@InjectDataSource() db: DataSource) {
    super();
    this.repo = new SqlLikesRepository(db, 'post_like');
  }

  public async get(entityId: string, userId: string): Promise<Like> {
    return this.repo.get(entityId, userId);
  }
  public async create(data: Like): Promise<boolean> {
    return this.repo.create(data);
  }
  public async update(data: Like): Promise<boolean> {
    return this.repo.update(data);
  }
}
