import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../common/models/page.view.model';
import BlogMapper from './models/blog.mapper';
import Blog, { BlogDocument } from './models/blog.schema';
import BlogViewModel from './models/blog.view.model';
import GetBlogsQuery from './models/get.blogs.query';

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
  public async getBlog(id: string): Promise<BlogViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? BlogMapper.toView(result) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  private async getPage(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<BlogViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<BlogViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetBlogsQuery): Promise<number> {
    try {
      const filter = this.getFilter(params.searchNameTerm);
      return this.model.countDocuments(filter).exec();
    } catch (error) {
      return 0;
    }
  }
  private getDbQuery(params: GetBlogsQuery): any {
    const filter = this.getFilter(params.searchNameTerm);
    return this.model
      .find(filter)
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private getFilter(searchNameTerm: string | null): any {
    return searchNameTerm ? { name: RegExp(searchNameTerm, 'i') } : {};
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
}
