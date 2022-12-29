import { Repository } from 'typeorm';
import RecoveryRepository from '../interfaces/recovery.repository';
import { Recovery } from './models/recovery';
import { InjectRepository } from '@nestjs/typeorm';

export class OrmRecoveryRepository extends RecoveryRepository {
  constructor(
    @InjectRepository(Recovery)
    private readonly repo: Repository<Recovery>,
  ) {
    super();
  }

  public async get(userId: string): Promise<Recovery | undefined> {
    try {
      const recovery = await this.repo.findOne({ where: { userId } });
      return recovery ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getByCode(code: string): Promise<Recovery | undefined> {
    try {
      const recovery = await this.repo.findOne({ where: { code } });
      return recovery ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async createOrUpdate(model: Recovery): Promise<boolean> {
    try {
      const result = await this.repo.save(model);
      return !!result.userId;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async delete(userId: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(userId);
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
