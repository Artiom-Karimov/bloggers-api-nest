import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SessionsRepository from '../interfaces/sessions.repository';
import SessionModel from '../models/session.model';
import SessionMapper from './models/mappers/session.mapper';
import Session from './models/session';

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
  public create(session: SessionModel): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public update(session: SessionModel): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public delete(deviceId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public deleteAllButOne(userId: string, deviceId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  public deleteAll(userId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
