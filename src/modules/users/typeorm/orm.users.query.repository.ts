import PageViewModel from '../../../common/models/page.view.model';
import SessionUserViewModel from '../models/view/session.user.view.model';
import GetUsersQuery, { BanStatus } from '../models/input/get.users.query';
import UserViewModel from '../models/view/user.view.model';
import UsersQueryRepository from '../interfaces/users.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
      const page = await this.loadPageUsers(params);
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

  private appendFilter(
    qb: SelectQueryBuilder<User>,
    params: GetUsersQuery,
  ): SelectQueryBuilder<User> {
    const filterSet = this.appendUserFilter(qb, params);
    this.appendBanFilter(qb, params, filterSet);
    return qb;
  }
  private appendUserFilter(
    qb: SelectQueryBuilder<User>,
    params: GetUsersQuery,
  ): boolean {
    const { searchLoginTerm, searchEmailTerm } = params;
    if (searchLoginTerm && searchEmailTerm) {
      qb = qb.where(`"login" ilike :login or "email" ilike :email`, {
        login: `%${searchLoginTerm}%`,
        email: `%${searchEmailTerm}%`,
      });
      return true;
    }
    if (searchLoginTerm) {
      qb = qb.where(`"user"."login" ilike :login`, {
        login: `%${searchLoginTerm}%`,
      });
      return true;
    }
    if (searchEmailTerm) {
      qb = qb.where(`"user"."email" ilike :email`, {
        email: `%${searchEmailTerm}%`,
      });
      return true;
    }
    return false;
  }
  private appendBanFilter(
    qb: SelectQueryBuilder<User>,
    params: GetUsersQuery,
    useAnd: boolean,
  ) {
    const { banStatus } = params;
    if (banStatus === BanStatus.All) return;
    let filter: string;
    if (banStatus === BanStatus.Banned) {
      filter = `"ban"."isBanned" = true`;
    } else {
      filter = `("ban"."isBanned" = false or "ban"."isBanned" is null)`;
    }
    if (useAnd) qb.andWhere(filter);
    else qb.where(filter);
  }

  private async loadPageUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const page = new PageViewModel<UserViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const qb = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.ban', 'ban');
    this.appendFilter(qb, params);

    const [result, count] = await qb
      .orderBy(`"${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getManyAndCount();

    page.setTotalCount(count);
    const promises = result.map((u) => UserMapper.toView(u));
    const views = await Promise.all(promises);

    return page.add(...views);
  }
}
