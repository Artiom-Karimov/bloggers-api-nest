import { Injectable } from '@nestjs/common';
import { Comment } from '../models/comment';
import CommentsRepository from '../../interfaces/comments.repository';

@Injectable()
export class OrmCommentsRepository extends CommentsRepository {
  public async get(id: string): Promise<Comment | undefined>;
  public async create(comment: Comment): Promise<string | undefined>;
  public async update(model: Comment): Promise<boolean>;
  public async delete(id: string): Promise<boolean>;
  public async banByBlogger(
    userId: string,
    blogId: string,
    bannedByBlogger: boolean,
  ): Promise<void>;
}
