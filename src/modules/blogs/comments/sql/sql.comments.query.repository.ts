import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../../common/models/page.view.model';
import { LikesInfoModel } from '../../likes/models/likes.info.model';
import Comment from './models/comment';
import CommentsQueryRepository from '../comments.query.repository';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentViewModel from '../models/view/comment.view.model';
import CommentMapper from './models/comment.mapper';

@Injectable()
export default class SqlCommentsQueryRepository extends CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    try {
      const page = await this.getPage(params);
      return this.loadComments(page, params);
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  // TODO: Get actual likes
  public async getComment(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | undefined> {
    const result = await this.db.query(
      `
      select "id","postId","userId","userLogin","bannedByAdmin",
      "bannedByBlogger","content","createdAt",
      ${this.getLikeSubqueries(userId)}
      from "comment" c
      where "bannedByAdmin" = false and "bannedByBlogger" = false and"id" = $1;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const comment = result[0] as Comment & LikesInfoModel;
    return CommentMapper.toView(comment);
  }
  private getLikeSubqueries(userId: string | undefined): string {
    return `
      (select count(*) from "like"
      where "userBanned" = false and "entityId" = c."id" and "status" = 'Like') as "likesCount",
      (select count(*) from "like"
      where "userBanned" = false and "entityId" = c."id" and "status" = 'Dislike') as "dislikesCount",
      ${this.getStatusSubquery(userId)}
    `;
  }
  private getStatusSubquery(userId: string | undefined): string {
    if (!userId) return `(select 'None') as "myStatus"`;
    return `(select "status" from "like" 
    where "userBanned" = false and "entityId" = c."id" and "userId" = '${userId}') as "myStatus"`;
  }

  private async getPage(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<CommentViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetCommentsQuery): Promise<number> {
    const filter = this.getFilter(params);

    const result = await this.db.query(
      `select count(*) from "comment"
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetCommentsQuery) {
    const notBanned = `("bannedByAdmin" = false and "bannedByBlogger" = false)`;
    const postId = `"postId" = '${params.postId}'`;
    return `where ${postId} and ${notBanned}`;
  }

  // TODO: get actual likes
  private async loadComments(
    page: PageViewModel<CommentViewModel>,
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Array<Comment & LikesInfoModel> = await this.db.query(
      `
      select "id","postId","userId","userLogin","bannedByAdmin",
      "bannedByBlogger","content","createdAt",
      ${this.getLikeSubqueries(params.userId)}
      from "comment" c
      ${filter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2;
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((c) => CommentMapper.toView(c));
    return page.add(...views);
  }
}