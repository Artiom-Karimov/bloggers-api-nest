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
      const session = await this.repo.findOne({
        where: { deviceId },
        relations: { user: true },
      });
      return session ?? undefined;
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
        .where('"userId" = :userId and "deviceId" != :deviceId', {
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
        .createQueryBuilder()
        .delete()
        .where('"userId" = :userId', {
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
