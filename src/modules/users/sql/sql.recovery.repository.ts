import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import RecoveryRepository from '../interfaces/recovery.repository';
import RecoveryModel from '../models/recovery.model';
import RecoveryMapper from './models/mappers/recovery.mapper';
import Recovery from './models/recovery';

@Injectable()
export default class SqlRecoveryRepository extends RecoveryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(userId: string): Promise<RecoveryModel | undefined> {
    const result = await this.db.query(
      `
    select "userId","code","expiration"
    from "passwordRecovery"
    where "userId" = $1;
    `,
      [userId],
    );
    if (!(result instanceof Array)) return undefined;
    const session = result[0] as Recovery;
    return session ? RecoveryMapper.toDomain(session) : undefined;
  }

  public async getByCode(code: string): Promise<RecoveryModel | undefined> {
    const result = await this.db.query(
      `
    select "userId","code","expiration"
    from "passwordRecovery"
    where "code" = $1;
    `,
      [code],
    );
    if (!(result instanceof Array)) return undefined;
    const session = result[0] as Recovery;
    return session ? RecoveryMapper.toDomain(session) : undefined;
  }

  public async createOrUpdate(model: RecoveryModel): Promise<boolean> {
    const existing = await this.get(model.userId);
    if (existing) return this.update(model);
    return this.create(model);
  }

  public async delete(userId: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "passwordRecovery"
      where "userId" = $1;
      `,
      [userId],
    );
    return !!result[1];
  }

  private async create(model: RecoveryModel): Promise<boolean> {
    const dbRecovery = RecoveryMapper.fromDomain(model);
    await this.db.query(
      `
      insert into "passwordRecovery" ("userId","code","expiration")
      values ($1,$2,$3);
      `,
      [dbRecovery.userId, dbRecovery.code, dbRecovery.expiration],
    );
    return true;
  }
  private async update(model: RecoveryModel): Promise<boolean> {
    const dbRecovery = RecoveryMapper.fromDomain(model);
    const result = await this.db.query(
      `
      update "passwordRecovery"
      set "code" = $2, "expiration" = $3
      where "userId" = $1;
      `,
      [dbRecovery.userId, dbRecovery.code, dbRecovery.expiration],
    );
    return !!result[1];
  }
}
