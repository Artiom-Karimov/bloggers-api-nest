import { Repository } from 'typeorm';
import SessionsRepository from '../interfaces/sessions.repository';
import { Session } from './models/session';
import { InjectRepository } from '@nestjs/typeorm';

export class OrmSessionsRepository extends SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
  ) {
    super();
  }

  public async get(deviceId: string): Promise<Session | undefined> {
    try {
      const user = await this.repo.findOne({ where: { deviceId } });
      return user ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(session: Session): Promise<string | undefined> {
    try {
      const result = await this.repo.save(session);
      return result.deviceId ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(session: Session): Promise<boolean> {
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
