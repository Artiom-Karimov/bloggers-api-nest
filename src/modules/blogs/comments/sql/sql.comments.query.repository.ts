import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../../common/models/page.view.model';
import { LikesInfoModel } from '../../likes/models/likes.info.model';
import CommentsQueryRepository from '../interfaces/comments.query.repository';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentViewModel from '../models/view/comment.view.model';
import CommentMapper from '../typeorm/models/comment.mapper';

@Injectable()
export default class SqlCommentsQueryRepository {
  private async getOne(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | undefined> {
    return undefined;
    // const result = await this.db.query(
    //   `
    //   select c."id", c."postId", c."userId", u."login" as "userLogin",
    //   c."bannedByAdmin", c."bannedByBlogger", c."content", c."createdAt",
    //   ${this.getLikeSubqueries(userId)}
    //   from "comment" c left join "user" u
    //   on c."userId" = u."id"
    //   where "bannedByAdmin" = false and "bannedByBlogger" = false and c."id" = $1;
    //   `,
    //   [id],
    // );
    // if (!result || result.length === 0) return undefined;
    //const comment = result[0] as Comment & LikesInfoModel;
    //return CommentMapper.toView(comment);
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
    return page;
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    // const result: Array<Comment & LikesInfoModel> = await this.db.query(
    //   `
    //   select c."id",c."postId",c."userId",u."login" as "userLogin",
    //   c."bannedByAdmin",c."bannedByBlogger",c."content",c."createdAt",
    //   ${this.getLikeSubqueries(params.userId)}
    //   from "comment" c left join "user" u on c."userId" = u."id"
    //   ${filter}
    //   order by "${params.sortBy}" ${order}
    //   limit $1 offset $2;
    //   `,
    //   [page.pageSize, page.calculateSkip()],
    // );
    //const views = result.map((c) => CommentMapper.toView(c));
    //return page.add(...views);
  }
}
