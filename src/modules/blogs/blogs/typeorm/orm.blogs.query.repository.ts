import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BlogViewModel from '../models/view/blog.view.model';
import GetBlogsQuery from '../models/input/get.blogs.query';
import BlogsQueryRepository from '../interfaces/blogs.query.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './models/blog';
import BlogMapper from './models/mappers/blog.mapper';

@Injectable()
export class OrmBlogsQueryRepository extends BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
  ) {
    super();
  }

  public async getBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<BlogViewModel>> {
    try {
      const page = await this.loadBlogs(params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }
  public async getBloggerBlogs(
    params: GetBlogsQuery,
    bloggerId: string,
  ): Promise<PageViewModel<BlogViewModel>> {
    try {
      const page = await this.loadBlogs(params, bloggerId);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getBlog(id: string): Promise<BlogViewModel | undefined> {
    try {
      const blog = await this.repo
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.ban', 'ban')
        .where('"id" = :id', { id })
        .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)')
        .getOne();
      return blog ? BlogMapper.toView(blog) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private getQueryBuilder(
    params: GetBlogsQuery,
    bloggerId?: string,
  ): SelectQueryBuilder<Blog> {
    const builder = this.repo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.ban', 'ban')
      .where('("ban"."isBanned" = false or "ban"."isBanned" is null)');
    if (bloggerId) {
      builder.andWhere('"ownerId" = :bloggerId', { bloggerId });
    }
    if (params.searchNameTerm) {
      builder.andWhere('"name" ilike :term', {
        term: `%${params.searchNameTerm}%`,
      });
    }
    return builder;
  }
  private async loadBlogs(
    params: GetBlogsQuery,
    bloggerId?: string,
  ): Promise<PageViewModel<BlogViewModel>> {
    const page = new PageViewModel<BlogViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const builder = this.getQueryBuilder(params, bloggerId);

    const [result, count] = await builder
      .orderBy(`"${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getManyAndCount();

    page.setTotalCount(count);
    const views = result.map((u) => BlogMapper.toView(u));
    return page.add(...views);
  }
}
