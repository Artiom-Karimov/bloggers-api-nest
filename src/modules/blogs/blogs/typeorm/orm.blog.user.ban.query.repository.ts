import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import GetBlogUserBansQuery from '../models/input/get.blog.user.bans.query';
import BlogUserBanViewModel from '../models/view/blog.user.ban.view.model';
import BlogUserBanQueryRepository from '../interfaces/blog.user.ban.query.repository';
import { BlogUserBan } from './models/blog.user.ban';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import BlogUserBanMapper from './models/mappers/blog.user.ban.mapper';

@Injectable()
export class OrmBlogUserBanQueryRepository extends BlogUserBanQueryRepository {
  constructor(
    @InjectRepository(BlogUserBan)
    private readonly repo: Repository<BlogUserBan>,
  ) {
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
    const builder = this.getQueryBuilder(params);
    return builder.getCount();
  }
  private getQueryBuilder(
    params: GetBlogUserBansQuery,
  ): SelectQueryBuilder<BlogUserBan> {
    const builder = this.repo
      .createQueryBuilder('ban')
      .leftJoinAndSelect('ban.user', 'user')
      .where('"blogId" = :id', { id: params.blogId });

    if (params.searchLoginTerm) {
      builder.andWhere('"user"."login" ilike :term', {
        term: params.searchLoginTerm,
      });
    }
    return builder;
  }
  private async loadPageBans(
    page: PageViewModel<BlogUserBanViewModel>,
    params: GetBlogUserBansQuery,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    const builder = this.getQueryBuilder(params);
    const result = await builder
      .orderBy(`"${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getMany();

    const views = result.map((u) => BlogUserBanMapper.toView(u));
    return page.add(...views);
  }
}
