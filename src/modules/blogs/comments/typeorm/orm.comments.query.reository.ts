import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import CommentViewModel from '../models/view/comment.view.model';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentsQueryRepository from '../interfaces/comments.query.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import CommentMapper from './models/comment.mapper';
import { LikesInfoModel } from '../../likes/models/likes.info.model';
import { Comment } from './models/comment';

@Injectable()
export class OrmCommentsQueryRepository extends CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
    @InjectDataSource() private readonly db: DataSource,
  ) {
    super();
  }

  public async getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    try {
      const page = await this.loadComments(params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getComment(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | undefined> {
    try {
      const comment = await this.repo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('user.ban', 'ban')
        .where('"comment"."id" = :id', { id })
        .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)')
        .getOne();

      return comment ? this.mapWithLikes(comment, userId) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private getQueryBuilder(
    params: GetCommentsQuery,
    page: PageViewModel<CommentViewModel>,
  ): SelectQueryBuilder<Comment> {
    const builder = this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin('user.ban', 'ban')
      .where('"bannedByBlogger" = false')
      .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)');
    if (params.postId) {
      builder.andWhere('"postId" = :postId', { postId: params.postId });
    }
    return builder
      .orderBy(`"comment"."${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize);
  }

  private async loadComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const page = new PageViewModel<CommentViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const builder = this.getQueryBuilder(params, page);
    const [result, count] = await builder.getManyAndCount();
    page.setTotalCount(count);

    const views = await this.mapManyWithLikes(result, params.userId);
    return page.add(...views);
  }

  private async mapManyWithLikes(
    comments: Comment[],
    userId?: string,
  ): Promise<CommentViewModel[]> {
    if (comments.length === 0) return [];

    const ids = comments.map((c) => `'${c.id}'`);

    const result = await this.db.query(
      `
      select c."id", ${this.getLikesQuery(userId)}
      from "comment" c
      where c."id" in (${ids.join(', ')})
      `,
    );
    return comments.map((c) => {
      const info = result.find((i) => i.id === c.id);
      return CommentMapper.toView(
        c,
        new LikesInfoModel(
          +info.likesCount,
          +info.dislikesCount,
          info.myStatus,
        ),
      );
    });
  }

  private async mapWithLikes(
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
        result[0].myStatus,
      ),
    );
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
  private getStatusSubquery(userId: string | undefined): string {
    if (!userId) return `(select 'None') as "myStatus"`;
    return `(select "status" from "comment_like" l
    left join "user_ban" b on l."userId" = b."userId" 
    where (b."isBanned" = false or b."isBanned" is null)
    and l."entityId" = c."id" and l."userId" = '${userId}') as "myStatus"`;
  }
}
