import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import UsersBanRepository from '../interfaces/users.ban.repository';
import UserBanModel from '../models/user.ban.model';
import UserBanMapper from './models/mappers/user.ban.mapper';
import UserBan from './models/user.ban';

@Injectable()
export default class SqlUsersBanRepository extends UsersBanRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(userId: string): Promise<UserBanModel | undefined> {
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
    return session ? UserBanMapper.toDomain(session) : undefined;
  }
  public async createOrUpdate(model: UserBanModel): Promise<boolean> {
    const existing = await this.get(model.userId);
    if (existing) return this.update(model);
    return this.create(model);
  }
  public async delete(userId: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "userBan"
      where "userId" = $1;
      `,
      [userId],
    );
    return !!result[1];
  }

  private async create(model: UserBanModel): Promise<boolean> {
    const dbBan = UserBanMapper.fromDomain(model);
    await this.db.query(
      `
      insert into "userBan" ("userId","isBanned","banReason","banDate")
      values ($1,$2,$3,$4);
      `,
      [dbBan.userId, dbBan.isBanned, dbBan.banReason, dbBan.banDate],
    );
    return true;
  }
  private async update(model: UserBanModel): Promise<boolean> {
    const dbBan = UserBanMapper.fromDomain(model);
    const result = await this.db.query(
      `
      update "userBan"
      set "isBanned" = $2, "banReason" = $3, "banDate" = $4
      where "userId" = $1;
      `,
      [dbBan.userId, dbBan.isBanned, dbBan.banReason, dbBan.banDate],
    );
    return !!result[1];
  }
}
