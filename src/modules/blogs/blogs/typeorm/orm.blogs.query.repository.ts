import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BlogViewModel from '../models/view/blog.view.model';
import GetBlogsQuery from '../models/input/get.blogs.query';
import BlogsQueryRepository from '../interfaces/blogs.query.repository';
import { Repository } from 'typeorm';
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
  ): Promise<PageViewModel<BlogViewModel>> { }
  public async getBloggerBlogs(
    params: GetBlogsQuery,
    bloggerId: string,
  ): Promise<PageViewModel<BlogViewModel>> { }

  public async getBlog(id: string): Promise<BlogViewModel | undefined> { }
}
