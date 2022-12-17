import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../common/models/page.view.model';
import UsersQueryRepository from '../interfaces/users.query.repository';
import GetUsersQuery, { BanStatus } from '../models/input/get.users.query';
import SessionUserViewModel from '../models/view/session.user.view.model';
import UserViewModel from '../models/view/user.view.model';
import UserMapper from './models/mappers/user.mapper';
import User from './models/user';
import UserWithBan from './models/user.with.ban';

@Injectable()
export default class SqlUsersQueryRepository extends UsersQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    try {
      const page = await this.getPage(params);
      return this.loadPageUsers(page, params);
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getUser(id: string): Promise<UserViewModel | undefined> {
    try {
      return await this.getOne(id);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  private async getOne(id: string): Promise<UserViewModel | undefined> {
    const result = await this.db.query(
      `
    select u."id",u."login",u."email",u."hash",u."createdAt",
    b."isBanned",b."banReason",b."banDate"
    from "user" u left join "userBan" b
    on u."id" = b."userId"
    where u."id" = $1;
    `,
      [id],
    );
    if (!(result instanceof Array)) return undefined;
    const user = result[0] as UserWithBan;

    return user ? UserMapper.toView(user) : undefined;
  }

  public async getSessionUserView(
    id: string,
  ): Promise<SessionUserViewModel | undefined> {
    try {
      return await this.getOneSessionView(id);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  private async getOneSessionView(
    id: string,
  ): Promise<SessionUserViewModel | undefined> {
    const result = await this.db.query(
      `
    select "id","login","email","hash","createdAt"
    from "user"
    where "id" = $1;
    `,
      [id],
    );
    if (!(result instanceof Array)) return undefined;
    const user = result[0] as User;
    return user ? UserMapper.toSessionView(user) : undefined;
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

    const result = await this.db.query(
      `select count(*) from "user" u
      left join "userBan" b 
      on u."id" = b."userId"
      ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(params: GetUsersQuery): string {
    const userFilter = this.getUserFilter(params);
    const banFilter = this.getBanFilter(params);

    if (userFilter && banFilter)
      return `where (${userFilter}) and (${banFilter})`;
    if (userFilter) return `where ${userFilter}`;
    if (banFilter) return `where ${banFilter}`;
    return '';
  }
  private getBanFilter(params: GetUsersQuery): string {
    const { banStatus } = params;
    if (banStatus === BanStatus.Banned) return `"isBanned" = True`;
    if (banStatus === BanStatus.NotBanned)
      return `"isBanned" = False or "isBanned" is null`;
    return '';
  }
  private getUserFilter(params: GetUsersQuery): string {
    const lt = params.searchLoginTerm;
    const et = params.searchEmailTerm;

    const login = `lower("login") like '%${lt?.toLowerCase()}%'`;
    const email = `lower("email") like '%${et?.toLowerCase()}%'`;

    if (lt && et) {
      return `${login} or ${email}`;
    }
    if (lt) return login;
    if (et) return email;
    return '';
  }

  private async loadPageUsers(
    page: PageViewModel<UserViewModel>,
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const filter = this.getFilter(params);
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result = await this.db.query(
      `
      select u."id",u."login",u."email",u."hash",u."createdAt",
      b."isBanned",b."banReason",b."banDate"
      from "user" u left join "userBan" b
      on u."id" = b."userId"
      ${filter}
      order by "${params.sortBy}" ${order}
      limit ${page.pageSize} offset ${page.calculateSkip()}
      `,
    );

    const views = result.map((u) => UserMapper.toView(u));

    return page.add(...views);
  }
}
