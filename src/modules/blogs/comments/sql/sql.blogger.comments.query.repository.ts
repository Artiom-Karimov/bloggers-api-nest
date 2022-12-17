import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../../common/models/page.view.model';
import { LikesInfoModel } from '../../likes/models/likes.info.model';
import BloggerCommentsQueryRepository from '../blogger.comments.query.repository';
import GetBloggerCommentsQuery from '../models/input/get.blogger.comments.query';
import BloggerCommentViewModel from '../models/view/blogger.comment.view.model';
import CommentMapper from './models/comment.mapper';
import CommentWithPost from './models/comment.with.post';

@Injectable()
export default class SqlBloggerCommentsQueryRepository extends BloggerCommentsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getBloggerComments(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    try {
      const page = await this.getPage(params);
      return this.loadComments(page, params);
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  private async getPage(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<BloggerCommentViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetBloggerCommentsQuery): Promise<number> {
    const filter = this.getFilter(params);

    const result = await this.db.query(
      `select count(*) from "comment" c 
      left join "post" p
      on c."postId" = p."id"
      left join "blogOwner" bo
      on p."blogId" = bo."blogId"
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetBloggerCommentsQuery) {
    const notBanned = `(c."bannedByAdmin" = false and c."bannedByBlogger" = false)`;
    const bloggerId = `bo."userId" = '${params.bloggerId}'`;
    return `where ${bloggerId} and ${notBanned}`;
  }

  private async loadComments(
    page: PageViewModel<BloggerCommentViewModel>,
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Array<CommentWithPost & LikesInfoModel> = await this.db.query(
      `
      select c."id",c."postId",c."userId",c."userLogin",c."bannedByAdmin",
      c."bannedByBlogger",c."content",c."createdAt",
      p."id" as "postId", p."title" as "postTitle", p."blogId", b."name" as "blogName",
      ${this.getLikeSubqueries(params.bloggerId)}
      from "comment" c 
      left join "post" p on c."postId" = p."id"
      left join "blog" b on p."blogId" = b."id"
      left join "blogOwner" bo on b."id" = bo."blogId"
      ${filter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2;
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((u) => CommentMapper.toBloggerView(u));
    return page.add(...views);
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
}
