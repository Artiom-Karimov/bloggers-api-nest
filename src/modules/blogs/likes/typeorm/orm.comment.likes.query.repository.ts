import { Injectable } from '@nestjs/common';
import { Comment } from '../../comments/typeorm/models/comment';
import CommentViewModel from '../../comments/models/view/comment.view.model';
import { CommentLikesQueryRepository } from '../interfaces/comment.likes.query.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral } from 'typeorm';
import CommentMapper from '../../comments/typeorm/models/comment.mapper';
import { LikesInfoModel } from '../models/likes.info.model';
import BloggerCommentViewModel from '../../comments/models/view/blogger.comment.view.model';

@Injectable()
export class OrmCommentLikesQueryRepository extends CommentLikesQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  async mergeWithLikes(
    comment: Comment,
    userId?: string,
  ): Promise<CommentViewModel> {
    const result = await this.db.query(
      `
      select c."id", ${this.getLikesQuery(userId)}
      from "comment" c
      where c."id" = '${comment.id}'
      `,
    );
    return CommentMapper.toView(
      comment,
      new LikesInfoModel(
        +result[0].likesCount,
        +result[0].dislikesCount,
        result[0].myStatus ?? 'None',
      ),
    );
  }
  async mergeManyWithLikes(
    comments: Comment[],
    userId?: string,
  ): Promise<CommentViewModel[]> {
    const likes = await this.getLikesArray(comments, userId);
    return comments.map((c) => {
      const info = likes.find((i) => i.id === c.id);
      return CommentMapper.toView(
        c,
        new LikesInfoModel(
          +info.likesCount,
          +info.dislikesCount,
          info.myStatus ?? 'None',
        ),
      );
    });
  }
  async mergeManyWithLikesBlogger(
    comments: Comment[],
    userId?: string,
  ): Promise<BloggerCommentViewModel[]> {
    const likes = await this.getLikesArray(comments, userId);
    return comments.map((c) => {
      const info = likes.find((i) => i.id === c.id);
      return CommentMapper.toBloggerView(
        c,
        new LikesInfoModel(
          +info.likesCount,
          +info.dislikesCount,
          info.myStatus ?? 'None',
        ),
      );
    });
  }

  private async getLikesArray(
    comments: Comment[],
    userId?: string,
  ): Promise<ObjectLiteral[]> {
    if (comments.length === 0) return [];

    const ids = comments.map((c) => `'${c.id}'`);

    const result = await this.db.query(
      `
      select c."id", ${this.getLikesQuery(userId)}
      from "comment" c
      where c."id" in (${ids.join(', ')})
      `,
    );
    return result;
  }

  private getLikesQuery(userId?: string): string {
    return `
      (select count(*) from "comment_like" l
      left join "user_ban" b on l."userId" = b."userId" 
      where (b."isBanned" = false or b."isBanned" is null) 
      and l."entityId" = c."id" and l."status" = 'Like') as "likesCount",

      (select count(*) from "comment_like" l
      left join "user_ban" b on l."userId" = b."userId" 
      where (b."isBanned" = false or b."isBanned" is null) 
      and l."entityId" = c."id" and l."status" = 'Dislike') as "dislikesCount",
      
      ${this.getStatusSubquery(userId)}
    `;
  }
  private getStatusSubquery(userId?: string): string {
    if (!userId) return `(select 'None') as "myStatus"`;
    return `(select "status" from "comment_like" l
    left join "user_ban" b on l."userId" = b."userId" 
    where (b."isBanned" = false or b."isBanned" is null)
    and l."entityId" = c."id" and l."userId" = '${userId}') as "myStatus"`;
  }
}
