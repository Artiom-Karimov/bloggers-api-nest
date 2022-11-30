import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../common/models/page.view.model';
import BlogUserBanMapper from './models/blog.user.ban.mapper';
import BlogUserBan, {
  BlogUserBanDocument,
} from './models/blog.user.ban.schema';
import GetBlogUserBansQuery from './models/input/get.blog.user.bans.query';
import BlogUserBanViewModel from './models/view/blog.user.ban.view.model';

@Injectable()
export default class BlogUserBanQueryRepository {
  constructor(
    @InjectModel(BlogUserBan.name)
    private readonly model: Model<BlogUserBanDocument>,
  ) { }

  public async getUsers(
    params: GetBlogUserBansQuery,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    const page = await this.getPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageItems(page, query);
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
    try {
      const filter = this.getFilter(params.blogId, params.searchLoginTerm);
      return this.model.countDocuments(filter).exec();
    } catch (error) {
      return 0;
    }
  }
  private getDbQuery(params: GetBlogUserBansQuery): any {
    const filter = this.getFilter(params.blogId, params.searchLoginTerm);
    const sortBy = this.getSortValue(params.sortBy);
    return this.model
      .find(filter)
      .sort({ [sortBy]: params.sortDirection as SortOrder });
  }
  private getFilter(blogId: string, searchLoginTerm?: string): any {
    const filter: {
      userLogin?: RegExp;
      blogId: string;
    } = { blogId };

    if (searchLoginTerm) {
      filter.userLogin = RegExp(searchLoginTerm, 'i');
    }

    return filter;
  }
  private getSortValue(sortBy: string): string {
    if (sortBy === 'login') return 'userLogin';
    if (sortBy === 'id') return 'userId';
    if (sortBy === 'banReason') return 'banReason';
    return 'banDate';
  }
  private async loadPageItems(
    page: PageViewModel<BlogUserBanViewModel>,
    query: any,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    try {
      const bans: BlogUserBan[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = bans.map((b) => BlogUserBanMapper.toView(b));
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
}
