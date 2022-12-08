import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SessionsRepository from '../interfaces/sessions.repository';
import SessionModel from '../models/session.model';
import SessionMapper from './models/mappers/session.mapper';
import Session from './models/session';

@Injectable()
export default class SqlSessionsRepository extends SessionsRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }
  public async get(deviceId: string): Promise<SessionModel | undefined> {
    const result = await this.db.query(
      `
    select "deviceId","deviceName","ip","userId","issuedAt","expiresAt"
    from "userSession"
    where "deviceId" = $1;
    `,
      [deviceId],
    );
    if (!(result instanceof Array)) return undefined;
    const session = result[0] as Session;
    return session ? SessionMapper.toDomain(session) : undefined;
  }
  public async create(session: SessionModel): Promise<string> {
    const dbSession = SessionMapper.fromDomain(session);
    await this.db.query(
      `
      insert into "userSession" ("deviceId","deviceName","ip","userId","issuedAt","expiresAt")
      values ($1,$2,$3,$4,$5,$6);
      `,
      [
        dbSession.deviceId,
        dbSession.deviceName,
        dbSession.ip,
        dbSession.userId,
        dbSession.issuedAt,
        dbSession.expiresAt,
      ],
    );
    return session.deviceId;
  }
  public async update(session: SessionModel): Promise<boolean> {
    const dbSession = SessionMapper.fromDomain(session);
    const result = await this.db.query(
      `
      update "userSession"
      set "deviceName" = $2, "ip" = $3, "issuedAt" = $4, "expiresAt" = $5
      where "deviceId" = $1;
      `,
      [
        dbSession.deviceId,
        dbSession.deviceName,
        dbSession.ip,
        dbSession.issuedAt,
        dbSession.expiresAt,
      ],
    );
    return !!result[1];
  }
  public async delete(deviceId: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "userSession"
      where "deviceId" = $1;
      `,
      [deviceId],
    );
    return !!result[1];
  }
  public async deleteAllButOne(
    userId: string,
    deviceId: string,
  ): Promise<number> {
    const result = await this.db.query(
      `
      delete from "userSession"
      where "userId" = $1 and "deviceId" != $2;
      `,
      [userId, deviceId],
    );
    return result[1] ?? 0;
  }
  public async deleteAll(userId: string): Promise<number> {
    const result = await this.db.query(
      `
      delete from "userSession"
      where "userId" = $1;
      `,
      [userId],
    );
    return result[1] ?? 0;
  }
}
