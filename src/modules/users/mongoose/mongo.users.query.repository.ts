import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../common/models/page.view.model';
import SessionUserViewModel from '../../auth/models/session.user.view.model';
import UserBanMapper from '../models/mappers/user.ban.mapper';
import UserBan, { UserBanDocument } from './models/user.ban.schema';
import UserBanViewModel from '../models/view/user.ban.view.model';
import GetUsersQuery from '../models/input/get.users.query';
import UserMapper from '../models/mappers/user.mapper';
import User, { UserDocument } from './models/user.schema';
import UserViewModel from '../models/view/user.view.model';
import UsersQueryRepository from '../users.query.repository';

@Injectable()
export default class MongoUsersQueryRepository extends UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    @InjectModel(UserBan.name)
    private readonly banModel: Model<UserBanDocument>,
  ) {
    super();
  }

  public async getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const page = await this.getPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageUsers(page, query);
  }
  public async getUser(id: string): Promise<UserViewModel | undefined> {
    try {
      const user = await this.model.findOne({ _id: id });
      if (!user) return undefined;
      const banView = await this.getBanView(id);
      return UserMapper.toView(user, banView);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async getSessionUserView(
    id: string,
  ): Promise<SessionUserViewModel | undefined> {
    try {
      const user = await this.model.findOne({ _id: id });
      if (!user) return undefined;
      return UserMapper.toSessionView(user);
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
      const viewModels = await this.mergeManyWithBanInfo(users);
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
  private async mergeManyWithBanInfo(users: User[]): Promise<UserViewModel[]> {
    const promises = users.map((u) => this.mergeWithBanInfo(u));
    return Promise.all(promises);
  }
  private async mergeWithBanInfo(user: User): Promise<UserViewModel> {
    const banView = await this.getBanView(user._id);
    return UserMapper.toView(user, banView);
  }
  private async getBanView(id: string): Promise<UserBanViewModel> {
    try {
      const banInfo = await this.banModel.findById(id);
      if (banInfo) return UserBanMapper.toView(banInfo);
      return UserBanMapper.emptyView();
    } catch (error) {
      return UserBanMapper.emptyView();
    }
  }
}
