import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../interfaces/sessions.repository';
import { BlogError } from '../../../blogs/blogs/models/blog.error';
import UsersBanRepository from '../../interfaces/users.ban.repository';
import UsersRepository from '../../interfaces/users.repository';
import BanUserCommand, {
  BanUserCreateModel,
} from '../commands/ban.user.command';
import { UserBan } from '../../typeorm/models/user.ban';

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly banRepo: UsersBanRepository,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  async execute(command: BanUserCommand): Promise<BlogError> {
    const userBanResult = await this.setUserBan(command.data);
    if (userBanResult !== BlogError.NoError) return userBanResult;

    return BlogError.NoError;
  }

  private async setUserBan(data: BanUserCreateModel): Promise<BlogError> {
    const user = await this.usersRepo.get(data.userId);
    if (!user) return BlogError.NotFound;
    let ban = await this.banRepo.get(user.id);

    if (ban) ban.setBan(data);
    else ban = UserBan.create(data, user);
    const created = await this.banRepo.createOrUpdate(ban);

    if (ban.isBanned) await this.sessionsRepo.deleteAll(user.id);

    return created ? BlogError.NoError : BlogError.Unknown;
  }
}
