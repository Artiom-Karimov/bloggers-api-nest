import { Repository } from 'typeorm';
import SessionsRepository from '../interfaces/sessions.repository';
import SessionModel from '../models/session.model';
import { Session } from './models/session';
import { InjectRepository } from '@nestjs/typeorm';
import SessionMapper from './models/mappers/session.mapper';

export class OrmSessionsRepository extends SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
  ) {
    super();
  }

  public async get(deviceId: string): Promise<SessionModel | undefined> {
    try {
      const user = await this.repo.findOne({ where: { deviceId } });
      if (!user) return undefined;
      return SessionMapper.toDomain(user);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(session: SessionModel): Promise<string | undefined> {
    try {
      const dbSession = SessionMapper.fromDomain(session);
      const result = await this.repo.save(dbSession);
      return result.deviceId;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(session: SessionModel): Promise<boolean> {
    return !!(await this.create(session));
  }

  public async delete(deviceId: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(deviceId);
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async deleteAllButOne(
    userId: string,
    deviceId: string,
  ): Promise<number> {
    try {
      const result = await this.repo
        .createQueryBuilder('s')
        .delete()
        .where('"s.userId" = :userId and "deviceId" != :deviceId', {
          userId,
          deviceId,
        })
        .execute();

      return result.affected;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  public async deleteAll(userId: string): Promise<number> {
    try {
      const result = await this.repo
        .createQueryBuilder('s')
        .delete()
        .where('"s.userId" = :userId', {
          userId,
        })
        .execute();

      return result.affected;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
}
