import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../common/models/page.view.model';
import AdminBlogViewModel from './models/admin.blog.view.model';
import BlogMapper from '../blogs/models/blog.mapper';
import Blog, { BlogDocument } from '../blogs/models/blog.schema';
import BlogViewModel from '../blogs/models/blog.view.model';
import GetBlogsQuery from '../blogs/models/get.blogs.query';

@Injectable()
export default class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly model: Model<BlogDocument>,
  ) { }

  public async getBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<BlogViewModel>> {
    const page = await this.getPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageBlogs(page, query);
  }
  public async getBloggerBlogs(
    params: GetBlogsQuery,
    bloggerId: string,
  ): Promise<PageViewModel<BlogViewModel>> {
    const page = await this.getPage(params, bloggerId);
    const query = this.getDbQuery(params, bloggerId);
    return this.loadPageBlogs(page, query);
  }
  public async getAdminBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const page = await this.getAdminPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageAdminBlogs(page, query);
  }
  public async getBlog(id: string): Promise<BlogViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? BlogMapper.toView(result) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  public async getAdminBlog(
    id: string,
  ): Promise<AdminBlogViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? BlogMapper.toAdminView(result) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
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
  private async getAdminPage(
    params: GetBlogsQuery,
    bloggerId?: string,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const count = await this.getCount(params, bloggerId);
    return new PageViewModel<AdminBlogViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(
    params: GetBlogsQuery,
    bloggerId?: string,
  ): Promise<number> {
    try {
      const filter = this.getFilter(params.searchNameTerm, bloggerId);
      return this.model.countDocuments(filter).exec();
    } catch (error) {
      return 0;
    }
  }
  private getDbQuery(params: GetBlogsQuery, bloggerId?: string): any {
    const filter = this.getFilter(params.searchNameTerm, bloggerId);
    return this.model
      .find(filter)
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private getFilter(searchNameTerm?: string, bloggerId?: string): any {
    const filter: { name?: RegExp; 'ownerInfo.userId'?: string } = {};
    if (searchNameTerm) {
      filter.name = RegExp(searchNameTerm, 'i');
    }
    if (bloggerId) {
      filter['ownerInfo.userId'] = bloggerId;
    }
    return filter;
  }
  private async loadPageBlogs(
    page: PageViewModel<BlogViewModel>,
    query: any,
  ): Promise<PageViewModel<BlogViewModel>> {
    try {
      const blogs: Blog[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = blogs.map((b) => BlogMapper.toView(b));
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
  private async loadPageAdminBlogs(
    page: PageViewModel<AdminBlogViewModel>,
    query: any,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    try {
      const blogs: Blog[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = blogs.map((b) => BlogMapper.toAdminView(b));
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
}