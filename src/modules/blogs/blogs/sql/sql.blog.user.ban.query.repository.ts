import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../../common/models/page.view.model';
import BlogUserBanQueryRepository from '../interfaces/blog.user.ban.query.repository';
import GetBlogUserBansQuery from '../models/input/get.blog.user.bans.query';
import BlogUserBanViewModel from '../models/view/blog.user.ban.view.model';
import { BlogUserBan } from './models/blog.user.ban';
import BlogUserBanMapper from './models/blog.user.ban.mapper';

@Injectable()
export default class SqlBlogUserBanQueryRepository extends BlogUserBanQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getUsers(
    params: GetBlogUserBansQuery,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadPageBans(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  private async getPage(
    params: GetBlogUserBansQuery,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<BlogUserBanViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetBlogUserBansQuery): Promise<number> {
    const filter = this.getFilter(params);

    const result = await this.db.query(
      `select count(*) from "blogUserBan" b
      left join "user" u
      on b."userId" = u."id"
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetBlogUserBansQuery): string {
    const lt = params.searchLoginTerm;
    const login = `lower("login") like '%${lt?.toLowerCase()}%'`;
    const id = `"blogId" = '${params.blogId}'`;

    if (lt) return `where ${id} and ${login}`;
    return `where ${id}`;
  }
  private async loadPageBans(
    page: PageViewModel<BlogUserBanViewModel>,
    params: GetBlogUserBansQuery,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result: BlogUserBan[] = await this.db.query(
      `
      select b."blogId", b."userId", b."isBanned", b."banReason", b."banDate", 
      u."login" as "userLogin", u."login" as "login"
      from "blogUserBan" b left join "user" u
      on b."userId" = u."id"
      ${filter}
      order by "${params.sortBy}" ${order}
      limit $1 offset $2
      `,
      [page.pageSize, page.calculateSkip()],
    );
    const views = result.map((u) => BlogUserBanMapper.toView(u));
    return page.add(...views);
  }
}
