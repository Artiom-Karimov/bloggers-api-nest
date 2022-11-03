import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from 'src/common/models/page.view.model';
import GetUsersQuery from './models/get.users.query';
import UserMapper from './models/user.mapper';
import User, { UserDocument } from './models/user.schema';
import UserViewModel from './models/user.view.model';

@Injectable()
export default class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) { }

  public async getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const page = await this.getPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageUsers(page, query);
  }
  public async getUser(id: string): Promise<UserViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? UserMapper.toView(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async getPage(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<UserViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetUsersQuery): Promise<number> {
    try {
      const filter = this.getFilter(
        params.searchLoginTerm,
        params.searchEmailTerm,
      );
      return this.model.countDocuments(filter).exec();
    } catch (error) {
      return 0;
    }
  }
  private getDbQuery(params: GetUsersQuery): any {
    const filter = this.getFilter(
      params.searchLoginTerm,
      params.searchEmailTerm,
    );
    return this.model
      .find(filter)
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private getFilter(loginTerm: string | null, emailTerm: string | null): any {
    if (loginTerm && emailTerm) {
      return {
        $or: [
          { login: RegExp(loginTerm, 'i') },
          { email: RegExp(emailTerm, 'i') },
        ],
      };
    }
    if (loginTerm) return { login: RegExp(loginTerm, 'i') };
    if (emailTerm) return { email: RegExp(emailTerm, 'i') };
    return {};
  }
  private async loadPageUsers(
    page: PageViewModel<UserViewModel>,
    query: any,
  ): Promise<PageViewModel<UserViewModel>> {
    try {
      const users: User[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = users.map((b) => UserMapper.toView(b));
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
}
