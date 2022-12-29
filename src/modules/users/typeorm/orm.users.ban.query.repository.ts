import { InjectRepository } from '@nestjs/typeorm';
import UsersBanQueryRepository from '../interfaces/users.ban.query.repository';
import UserBanViewModel from '../models/view/user.ban.view.model';
import { UserBan } from './models/user.ban';
import { Repository } from 'typeorm';
import UserBanMapper from './models/mappers/user.ban.mapper';

export class OrmUsersBanQueryRepository extends UsersBanQueryRepository {
  constructor(
    @InjectRepository(UserBan)
    private readonly repo: Repository<UserBan>,
  ) {
    super();
  }

  public async get(userId: string): Promise<UserBanViewModel | undefined> {
    try {
      const ban = await this.repo.findOne({ where: { userId } });
      if (!ban) return undefined;
      return UserBanMapper.toView(ban);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
