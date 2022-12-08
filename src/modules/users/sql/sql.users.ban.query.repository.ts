import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import UsersBanQueryRepository from '../interfaces/users.ban.query.repository';
import UserBanViewModel from '../models/view/user.ban.view.model';
import UserBanMapper from './models/mappers/user.ban.mapper';
import UserBan from './models/user.ban';

@Injectable()
export default class SqlUsersBanQueryRepository extends UsersBanQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(userId: string): Promise<UserBanViewModel | undefined> {
    const result = await this.db.query(
      `
      select "userId","isBanned","banReason","banDate"
      from "userBan"
      where "userId" = $1;
      `,
      [userId],
    );
    if (!(result instanceof Array)) return undefined;
    const session = result[0] as UserBan;
    return session ? UserBanMapper.toView(session) : undefined;
  }
}
