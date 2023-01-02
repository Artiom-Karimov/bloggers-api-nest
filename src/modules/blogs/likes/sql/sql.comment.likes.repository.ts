import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SqlLikesRepository from './sql.likes.rpository';
import CommentLikesRepository from '../interfaces/comment.likes.repository';
import { Like } from '../typeorm/models/like';

@Injectable()
export default class SqlCommentLikesRepository extends CommentLikesRepository {
  private readonly repo: SqlLikesRepository;

  constructor(@InjectDataSource() db: DataSource) {
    super();
    this.repo = new SqlLikesRepository(db, 'comment_like');
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
