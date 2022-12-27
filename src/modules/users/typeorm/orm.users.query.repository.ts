import PageViewModel from '../../../common/models/page.view.model';
import SessionUserViewModel from '../models/view/session.user.view.model';
import GetUsersQuery, { BanStatus } from '../models/input/get.users.query';
import UserViewModel from '../models/view/user.view.model';
import UsersQueryRepository from '../interfaces/users.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user';
import { ILike, Repository } from 'typeorm';
import UserMapper from './models/mappers/user.mapper';

export class OrmUsersQueryRepository extends UsersQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super();
  }

  public async getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadPageUsers(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getUser(id: string): Promise<UserViewModel | undefined> {
    try {
      const user = await this.repo.findOne({
        where: { id },
        relations: { ban: true },
      });
      if (!user) return undefined;
      const view = await UserMapper.toView(user);
      return view;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getSessionUserView(
    id: string,
  ): Promise<SessionUserViewModel | undefined> {
    try {
      const user = await this.repo.findOne({ where: { id } });
      if (!user) return undefined;
      const view = UserMapper.toSessionView(user);
      return view;
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
    const filter = this.getFilter(params);
    const result = await this.repo.count(filter);
    return result;
  }

  private getFilter(params: GetUsersQuery): any {
    const user = this.getUserFilter(params);
    const ban = this.getBanFilter(params);
    return {
      relations: { ban: true },
      where: { ...user, ...ban },
    };
  }
  private getUserFilter(params: GetUsersQuery) {
    const { searchLoginTerm, searchEmailTerm } = params;

    const login = ILike(`%${searchLoginTerm}%`);
    const email = ILike(`%${searchEmailTerm}%`);

    if (searchLoginTerm && searchEmailTerm) {
      return [{ login }, { email }];
    }
    if (searchLoginTerm) return { login };
    if (searchEmailTerm) return { email };
    return {};
  }
  private getBanFilter(params: GetUsersQuery): any {
    const { banStatus } = params;
    if (banStatus === BanStatus.All) return {};
    if (banStatus === BanStatus.Banned) return { isBanned: true };
    return [{ isBanned: false }, { isBanned: null }];
  }

  private async loadPageUsers(
    page: PageViewModel<UserViewModel>,
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const filter = this.getFilter(params);
    const result = await this.repo.find({
      ...filter,
      skip: page.calculateSkip(),
      take: page.pageSize,
      order: {
        [params.sortBy]: params.sortOrder,
      },
    });

    const promises = result.map((u) => UserMapper.toView(u));
    const views = await Promise.all(promises);

    return page.add(...views);
  }
}
