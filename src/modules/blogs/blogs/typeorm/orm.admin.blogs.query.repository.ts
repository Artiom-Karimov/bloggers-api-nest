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
      const page = await this.loadBlogs(params);
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
        .where('"blog"."id" = :id', { id })
        .getOne();
      return BlogMapper.toAdminView(blog) ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private getQueryBuilder(params: GetBlogsQuery): SelectQueryBuilder<Blog> {
    const builder = this.repo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.ban', 'ban')
      .leftJoinAndSelect('blog.owner', 'owner');

    if (params.searchNameTerm) {
      builder.andWhere('"name" ilike :term', {
        term: `%${params.searchNameTerm}%`,
      });
    }
    return builder;
  }
  private async loadBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const page = new PageViewModel<AdminBlogViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const builder = this.getQueryBuilder(params);

    const [result, count] = await builder
      .orderBy(`"blog"."${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getManyAndCount();

    page.setTotalCount(count);
    const views = result.map((u) => BlogMapper.toAdminView(u));
    return page.add(...views);
  }
}
