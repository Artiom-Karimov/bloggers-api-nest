import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SessionsQueryRepository from '../interfaces/sessions.query.repository';
import SessionViewModel from '../models/view/session.view.model';
import SessionMapper from './models/mappers/session.mapper';

@Injectable()
export default class SqlSessionsQueryRepository extends SessionsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }
  public async get(userId: string): Promise<SessionViewModel[]> {
    const result = await this.db.query(
      `
      select "deviceId","deviceName","ip","userId","issuedAt","expiresAt"
      from "userSession"
      where "userId" = $1;
      `,
      [userId],
    );
    return result.map((s) => SessionMapper.toView(s));
  }
}
