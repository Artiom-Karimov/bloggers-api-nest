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
    const page = await this.getPage(params);
    return this.loadPosts(page, params);
  }

  // TODO: get actual likes
  public async getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    const result = await this.db.query(
      `
      select p."id", p."blogId", p."blogBanned", p."title", 
      p."shortDescription", p."content", p."createdAt",
      b."name" as "blogName"
      from "post" p left join "blog" b
      on p."blogId" = b."id"
      where p."id" = $1 and p."blogBanned" = false;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const post = result[0] as Post;
    return PostMapper.toView(post, new ExtendedLikesInfoModel());
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
  // TODO: get actual likes
  private async loadPosts(
    page: PageViewModel<PostViewModel>,
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Post[] = await this.db.query(
      `
      select p."id", p."blogId", p."blogBanned", p."title", 
      p."shortDescription", p."content", p."createdAt",
      b."name" as "blogName"
      from "post" p left join "blog" b
      on p."blogId" = b."id"
      ${filter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2;
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((u) =>
      PostMapper.toView(u, new ExtendedLikesInfoModel()),
    );
    return page.add(...views);
  }
}
