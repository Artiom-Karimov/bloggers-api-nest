import { Repository } from 'typeorm';
import UsersBanRepository from '../interfaces/users.ban.repository';
import { UserBan } from './models/user.ban';
import { InjectRepository } from '@nestjs/typeorm';

export class OrmUsersBanRepository extends UsersBanRepository {
  constructor(
    @InjectRepository(UserBan)
    private readonly repo: Repository<UserBan>,
  ) {
    super();
  }

  public async get(userId: string): Promise<UserBan | undefined> {
    try {
      const ban = await this.repo.findOne({
        where: { userId },
        relations: { user: true },
      });
      return ban ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async createOrUpdate(model: UserBan): Promise<boolean> {
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
