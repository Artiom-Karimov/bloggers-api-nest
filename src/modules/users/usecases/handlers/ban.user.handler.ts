import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../interfaces/sessions.repository';
import UsersBanRepository from '../../interfaces/users.ban.repository';
import UsersRepository from '../../interfaces/users.repository';
import BanUserCommand from '../commands/ban.user.command';
import { UserBan } from '../../typeorm/models/user.ban';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly banRepo: UsersBanRepository,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  async execute(command: BanUserCommand): Promise<void> {
    const { data } = command;
    const user = await this.usersRepo.get(data.userId);
    if (!user) throw new NotFoundException('user not found');
    let ban = await this.banRepo.get(user.id);

    if (ban) ban.setBan(data);
    else ban = UserBan.create(data, user);
    const created = await this.banRepo.createOrUpdate(ban);

    if (ban.isBanned) await this.sessionsRepo.deleteAll(user.id);

    if (!created) throw new BadRequestException('cannot set ban');
  }
}
