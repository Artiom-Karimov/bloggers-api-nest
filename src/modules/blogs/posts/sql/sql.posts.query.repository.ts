import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../../common/models/page.view.model';
import { ExtendedLikesInfoModel } from '../../likes/models/likes.info.model';
import PostsQueryRepository from '../interfaces/posts.query.repository';
import GetPostsQuery from '../models/get.posts.query';
import PostViewModel from '../models/post.view.model';
import Post from './models/post';
import PostMapper from './models/post.mapper';

@Injectable()
export default class SqlPostsQueryRepository extends PostsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadPosts(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    try {
      const result = await this.getOne(id, userId);
      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async getOne(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    const result = await this.db.query(
      `
      select p."id", p."blogId", p."blogBanned", p."title", 
      p."shortDescription", p."content", p."createdAt",
      ${this.getLikeSubqueries(userId)},
      b."name" as "blogName"
      from "post" p left join "blog" b
      on p."blogId" = b."id"
      where p."id" = $1 and p."blogBanned" = false;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const post = result[0] as Post & ExtendedLikesInfoModel;
    return PostMapper.toView(post);
  }
  private getLikeSubqueries(userId: string | undefined): string {
    return `
      (select count(*) from "like"
      where "userBanned" = false and "entityId" = p."id" and "status" = 'Like') as "likesCount",
      (select count(*) from "like"
      where "userBanned" = false and "entityId" = p."id" and "status" = 'Dislike') as "dislikesCount",
      ${this.getStatusSubquery(userId)},
      ${this.getNewestLikesSubquery()}
    `;
  }
  private getStatusSubquery(userId: string | undefined): string {
    if (!userId) return `(select 'None') as "myStatus"`;
    return `(select "status" from "like" 
    where "userBanned" = false and "entityId" = p."id" and "userId" = '${userId}') as "myStatus"`;
  }
  private getNewestLikesSubquery(): string {
    return `(
      select json_agg(row_to_json(nl)) as "newestLikes" from (
        select "lastModified" as "addedAt", "userId", "login"
        from "like" l left join "user" u on l."userId" = u."id"
        where "status" = 'Like' and "userBanned" = false
        order by "lastModified" limit 3
      ) nl
    )`;
  }

  private async getPage(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<PostViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetPostsQuery): Promise<number> {
    const filter = this.getFilter(params);

    const result = await this.db.query(
      `select count(*) from "post" p
      left join "blog" b
      on p."blogId" = b."id" 
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetPostsQuery) {
    const notBanned = 'where "blogBanned" = false';
    const blogId = `"blogId" = '${params.blogId}'`;

    if (params.blogId) return `${notBanned} and ${blogId}`;
    return notBanned;
  }

  private async loadPosts(
    page: PageViewModel<PostViewModel>,
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Array<Post & ExtendedLikesInfoModel> = await this.db.query(
      `
      select p."id", p."blogId", p."blogBanned", p."title", 
      p."shortDescription", p."content", p."createdAt",
      ${this.getLikeSubqueries(params.userId)},
      b."name" as "blogName"
      from "post" p left join "blog" b
      on p."blogId" = b."id"
      ${filter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2;
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((p) => PostMapper.toView(p));
    return page.add(...views);
  }
}
