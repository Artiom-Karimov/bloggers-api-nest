import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import UsersBanQueryRepository from '../../../users/users.ban.query.repository';
import CheckUserBanQuery from '../queries/check.user.ban.query';

@QueryHandler(CheckUserBanQuery)
export default class CheckUserBanHandler
  implements IQueryHandler<CheckUserBanQuery>
{
  constructor(private readonly banRepo: UsersBanQueryRepository) { }

  public async execute(query: CheckUserBanQuery): Promise<boolean> {
    const ban = await this.banRepo.get(query.userId);
    if (ban?.isBanned) return true;
    return false;
  }
}
