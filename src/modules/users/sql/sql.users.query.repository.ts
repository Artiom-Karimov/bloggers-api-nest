import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../common/models/page.view.model';
import UsersQueryRepository from '../interfaces/users.query.repository';
import GetUsersQuery from '../models/input/get.users.query';
import SessionUserViewModel from '../models/view/session.user.view.model';
import UserBanViewModel from '../models/view/user.ban.view.model';
import UserViewModel from '../models/view/user.view.model';
import UserMapper from './models/mappers/user.mapper';
import User from './models/user';

export default class SqlUsersQueryRepository extends UsersQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>> {
    // TODO: return actual users
    return new PageViewModel(params.pageNumber, params.pageSize, 0);
  }

  public async getUser(id: string): Promise<UserViewModel | undefined> {
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

    // TODO: get actual ban info
    return user
      ? UserMapper.toView(user, new UserBanViewModel(false, null, null))
      : undefined;
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
}
