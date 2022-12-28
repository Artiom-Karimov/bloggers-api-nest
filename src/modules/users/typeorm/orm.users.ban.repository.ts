import { Repository } from 'typeorm';
import UsersBanRepository from '../interfaces/users.ban.repository';
import UserBanModel from '../models/user.ban.model';
import { UserBan } from './models/user.ban';
import { InjectRepository } from '@nestjs/typeorm';
import UserBanMapper from './models/mappers/user.ban.mapper';

export class OrmUsersBanRepository extends UsersBanRepository {
  constructor(
    @InjectRepository(UserBan)
    private readonly repo: Repository<UserBan>,
  ) {
    super();
  }

  public async get(userId: string): Promise<UserBanModel | undefined> {
    try {
      const user = await this.repo.findOne({ where: { userId } });
      if (!user) return undefined;
      return UserBanMapper.toDomain(user);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async createOrUpdate(model: UserBanModel): Promise<boolean> {
    try {
      const dbUser = UserBanMapper.fromDomain(model);
      const result = await this.repo.save(dbUser);
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
