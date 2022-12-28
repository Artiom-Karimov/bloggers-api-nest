import { Repository } from 'typeorm';
import RecoveryRepository from '../interfaces/recovery.repository';
import RecoveryModel from '../models/recovery.model';
import { Recovery } from './models/recovery';
import { InjectRepository } from '@nestjs/typeorm';
import RecoveryMapper from './models/mappers/recovery.mapper';

export class OrmRecoveryRepository extends RecoveryRepository {
  constructor(
    @InjectRepository(Recovery)
    private readonly repo: Repository<Recovery>,
  ) {
    super();
  }

  public async get(userId: string): Promise<RecoveryModel | undefined> {
    try {
      const recovery = await this.repo.findOne({ where: { userId } });
      if (!recovery) return undefined;
      return RecoveryMapper.toDomain(recovery);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getByCode(code: string): Promise<RecoveryModel | undefined> {
    try {
      const recovery = await this.repo.findOne({ where: { code } });
      if (!recovery) return undefined;
      return RecoveryMapper.toDomain(recovery);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async createOrUpdate(model: RecoveryModel): Promise<boolean> {
    try {
      const recovery = RecoveryMapper.fromDomain(model);
      const result = await this.repo.save(recovery);
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
