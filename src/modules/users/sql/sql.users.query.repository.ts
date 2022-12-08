import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../common/models/page.view.model';
import UsersQueryRepository from '../interfaces/users.query.repository';
import GetUsersQuery from '../models/input/get.users.query';
import SessionUserViewModel from '../models/view/session.user.view.model';
import UserViewModel from '../models/view/user.view.model';
import UserMapper from './models/mappers/user.mapper';
import User from './models/user';
import UserWithBan from './models/user.with.ban';

export default class SqlUsersQueryRepository extends UsersQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const page = await this.getPage(params);
    return this.loadPageUsers(page, params);
  }

  public async getUser(id: string): Promise<UserViewModel | undefined> {
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
    const filter = this.getFilter(
      params.searchLoginTerm,
      params.searchEmailTerm,
    );

    const result = await this.db.query(
      `select count(*) from "user" ${filter};`,
    );
    return +result[0]?.count ?? 0;
  }
  private getFilter(
    loginTerm: string | null,
    emailTerm: string | null,
  ): string {
    const login = `lower("login") like '%${loginTerm?.toLowerCase()}%'`;
    const email = `lower("email") like '%${emailTerm?.toLowerCase()}%'`;

    if (loginTerm && emailTerm) {
      return `where ${login} or ${email}`;
    }
    if (loginTerm) return `where ${login}`;
    if (emailTerm) return `where ${email}`;
    return '';
  }
  private async loadPageUsers(
    page: PageViewModel<UserViewModel>,
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    const filter = this.getFilter(
      params.searchLoginTerm,
      params.searchEmailTerm,
    );
    const order = params.sortDirection === 1 ? 'asc' : 'desc';

    const result = await this.db.query(
      `
      select u."id",u."login",u."email",u."hash",u."createdAt",
      b."isBanned",b."banReason",b."banDate"
      from (
        select "id","login","email","hash","createdAt"
        from "user"
        ${filter}
        order by "${params.sortBy}" ${order}
        limit ${page.pageSize} offset ${page.calculateSkip()}
      ) as u left join "userBan" b
      on u."id" = b."userId"
      `,
    );

    const views = result.map((u) => UserMapper.toView(u));

    return page.add(...views);
  }
}
