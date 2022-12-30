import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import GetBlogsQuery from '../models/input/get.blogs.query';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './models/blog';
import BlogMapper from './models/mappers/blog.mapper';
import AdminBlogsQueryRepository from '../interfaces/admin.blogs.query.repository';
import AdminBlogViewModel from '../models/view/admin.blog.view.model';

@Injectable()
export class OrmAdminBlogsQueryRepository extends AdminBlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
  ) {
    super();
  }

  public async getAdminBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadBlogs(page, params);
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
      const blog = await this.repo
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.ban', 'ban')
        .leftJoinAndSelect('blog.owner', 'owner')
        .where('"id" = :id', { id })
        .getOne();
      return BlogMapper.toAdminView(blog) ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
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
    const builder = this.getQueryBuilder(params);
    return builder.getCount();
  }
  private getQueryBuilder(params: GetBlogsQuery): SelectQueryBuilder<Blog> {
    const builder = this.repo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.ban', 'ban')
      .leftJoinAndSelect('blog.owner', 'owner');

    if (params.searchNameTerm) {
      builder.andWhere('"name" ilike :term', { term: params.searchNameTerm });
    }
    return builder;
  }
  private async loadBlogs(
    page: PageViewModel<AdminBlogViewModel>,
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const builder = this.getQueryBuilder(params);

    const result = await builder
      .orderBy(`"${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getMany();

    const views = result.map((u) => BlogMapper.toAdminView(u));
    return page.add(...views);
  }
}
