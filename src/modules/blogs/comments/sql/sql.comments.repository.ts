import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import CommentsRepository from '../interfaces/comments.repository';
import CommentModel from '../models/comment.model';
import Comment from './models/comment';
import CommentMapper from '../typeorm/models/comment.mapper';

@Injectable()
export default class SqlCommentsRepository extends CommentsRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(id: string): Promise<CommentModel | undefined> {
    const result = await this.db.query(
      `
      select "id","postId","userId","bannedByAdmin",
      "bannedByBlogger","content","createdAt"
      from "comment"
      where "id" = $1;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const comment = result[0] as Comment;
    return CommentMapper.toDomain(comment);
  }
  public async create(comment: CommentModel): Promise<string | undefined> {
    const dbComment = CommentMapper.fromDomain(comment);
    await this.db.query(
      `
      insert into "comment" ("id","postId","userId","bannedByAdmin",
      "bannedByBlogger","content","createdAt")
      values ($1,$2,$3,$4,$5,$6,$7);
      `,
      [
        dbComment.id,
        dbComment.postId,
        dbComment.userId,
        dbComment.bannedByAdmin,
        dbComment.bannedByBlogger,
        dbComment.content,
        dbComment.createdAt,
      ],
    );
    return dbComment.id;
  }
  public async update(model: CommentModel): Promise<boolean> {
    const dbComment = CommentMapper.fromDomain(model);
    const result = await this.db.query(
      `
      update "comment"
      set "content" = $2
      where "id" = $1;
      `,
      [dbComment.id, dbComment.content],
    );
    return !!result[1];
  }
  public async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "comment"
      where "id" = $1;
      `,
      [id],
    );
    return !!result[1];
  }
  public async banByAdmin(
    userId: string,
    bannedByAdmin: boolean,
  ): Promise<void> {
    return;
    await this.db.query(
      `
      update "comment" 
      set "bannedByAdmin" = $2
      where "userId" = $1;
      `,
      [userId, bannedByAdmin],
    );
  }
  public async banByBlogger(
    userId: string,
    blogId: string,
    bannedByBlogger: boolean,
  ): Promise<void> {
    await this.db.query(
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
