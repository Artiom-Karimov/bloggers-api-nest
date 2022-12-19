import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import AdminBlogViewModel from '../models/view/admin.blog.view.model';
import GetBlogsQuery from '../models/input/get.blogs.query';
import AdminBlogsQueryRepository from '../interfaces/admin.blogs.query.repository';
import BlogMapper from './models/blog.mapper';
import { Blog } from './models/blog';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export default class SqlAdminBlogsQueryRepository extends AdminBlogsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getAdminBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadPageBlogs(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getAdminBlog(
    id: string,
  ): Promise<AdminBlogViewModel | undefined> {
    try {
      const result = await this.getOne(id);
      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  private async getOne(id: string): Promise<AdminBlogViewModel | undefined> {
    const result: Array<any> = await this.db.query(
      `
      select b."id", b."name", b."description", b."websiteUrl", b."createdAt",
      o."userId", o."userLogin", bb."isBanned", bb."banDate"
      from 
      ("blog" b left join "blogOwner" o on b."id" = o."blogId")
      left join "blogBan" bb
      on b."id" = bb."blogId"
      where b."id" = $1;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const blog = result[0] as Blog;
    return BlogMapper.toAdminView(blog);
  }

  private async getPage(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<AdminBlogViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetBlogsQuery): Promise<number> {
    const filter = this.getFilter(params);

    const result = await this.db.query(
      `select count(*) from "blog"
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetBlogsQuery) {
    if (params.searchNameTerm)
      return `where lower("name") like '%${params.searchNameTerm.toLowerCase()}%'`;
    return '';
  }
  private async loadPageBlogs(
    page: PageViewModel<AdminBlogViewModel>,
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: Blog[] = await this.db.query(
      `
      select bo."id", bo."name", bo."description", bo."websiteUrl", bo."createdAt",
      bo."userId", bo."userLogin", bb."isBanned", bb."banDate"
      from 
      (
        select * from "blog" b
        left join "blogOwner" o on b."id" = o."blogId"
        ${filter}
        order by "${params.sortBy}" ${order}
        limit $1 offset $2
      ) as bo
      left join "blogBan" bb
      on bo."id" = bb."blogId"
      order by "${params.sortBy}" ${order}
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((u) => BlogMapper.toAdminView(u));
    return page.add(...views);
  }
}
