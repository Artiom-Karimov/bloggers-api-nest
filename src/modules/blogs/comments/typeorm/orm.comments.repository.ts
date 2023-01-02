import { Injectable } from '@nestjs/common';
import { Comment } from './models/comment';
import CommentsRepository from '../interfaces/comments.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrmCommentsRepository extends CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {
    super();
  }

  public async get(id: string): Promise<Comment | undefined> {
    try {
      const comment = await this.repo.findOne({ where: { id } });
      return comment ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(comment: Comment): Promise<string | undefined> {
    try {
      const result = await this.repo.save(comment);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(model: Comment): Promise<boolean> {
    return !!(await this.create(model));
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(id);
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async banByBlogger(
    userId: string,
    blogId: string,
    bannedByBlogger: boolean,
  ): Promise<void> {
    await this.repo.query(
      `
      update "comment" c
      set "bannedByBlogger" = $3
      from "post" p
      where c."postId" = p."id" and c."userId" = $1 and p."blogId" = $2;
      `,
      [userId, blogId, bannedByBlogger],
    );
  }
}
