import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BlogViewModel from '../models/view/blog.view.model';
import GetBlogsQuery from '../models/input/get.blogs.query';
import BlogsQueryRepository from '../interfaces/blogs.query.repository';
import BlogMapper from './models/blog.mapper';
import { Blog } from './models/blog';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export default class SqlBlogsQueryRepository extends BlogsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<BlogViewModel>> {
    const page = await this.getPage(params);
    return this.loadBlogs(page, params);
  }

  public async getBloggerBlogs(
    params: GetBlogsQuery,
    bloggerId: string,
  ): Promise<PageViewModel<BlogViewModel>> {
    const page = await this.getPage(params, bloggerId);
    return this.loadBloggerBlogs(page, params, bloggerId);
  }

  public async getBlog(id: string): Promise<BlogViewModel | undefined> {
    const result: Array<any> = await this.db.query(
      `
      select "id", "name", "description", "websiteUrl", "createdAt"
      from "blog" b
      left join "blogBan" bb
      on b."id" = bb."blogId"
      where "id" = $1 and ("isBanned" = false or "isBanned" is null);
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const blog = result[0] as Partial<Blog>;
    return BlogMapper.toView(blog);
  }

  private async getPage(
    params: GetBlogsQuery,
    bloggerId?: string,
  ): Promise<PageViewModel<BlogViewModel>> {
    const count = await this.getCount(params, bloggerId);
    return new PageViewModel<BlogViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(
    params: GetBlogsQuery,
    bloggerId?: string,
  ): Promise<number> {
    const filter = this.getFilter(params, bloggerId);

    const result = await this.db.query(
      `select count(*) from "blog" b
      left join "blogOwner" o
      on b."id" = o."blogId" 
      left join "blogBan" bb
      on b."id" = bb."blogId"
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetBlogsQuery, bloggerId?: string) {
    const notBanned = 'where ("isBanned" = false or "isBanned" is null)';
    const name = `lower("name") like '%${params.searchNameTerm?.toLowerCase()}%'`;
    const id = `"userId" = '${bloggerId}'`;

    if (params.searchNameTerm && bloggerId)
      return `${notBanned} and ${name} and ${id}`;
    if (params.searchNameTerm) return `${notBanned} and ${name}`;
    if (bloggerId) return `${notBanned} and ${id}`;
    return notBanned;
  }
  private async loadBlogs(
    page: PageViewModel<BlogViewModel>,
    params: GetBlogsQuery,
  ): Promise<PageViewModel<BlogViewModel>> {
    const blogFilter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Partial<Blog>[] = await this.db.query(
      `
      select "id", "name", "description", "websiteUrl", "createdAt"
      from "blog" b left join "blogBan" bb
      on b."id" = bb."blogId"
      ${blogFilter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2;
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((u) => BlogMapper.toView(u));
    return page.add(...views);
  }
  private async loadBloggerBlogs(
    page: PageViewModel<BlogViewModel>,
    params: GetBlogsQuery,
    bloggerId?: string,
  ): Promise<PageViewModel<BlogViewModel>> {
    const filter = this.getFilter(params, bloggerId);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Partial<Blog>[] = await this.db.query(
      `
      select b."id", b."name", b."description", b."websiteUrl", b."createdAt"
      from "blog" b 
      left join "blogOwner" o
      on b."id" = o."blogId"
      left join "blogBan" bb
      on b."id" = bb."blogId"
      ${filter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2;
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((u) => BlogMapper.toView(u));
    return page.add(...views);
  }
}
