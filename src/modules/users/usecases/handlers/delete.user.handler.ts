import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../interfaces/sessions.repository';
import EmailConfirmationRepository from '../../interfaces/email.confirmation.repository';
import UsersBanRepository from '../../interfaces/users.ban.repository';
import UsersRepository from '../../interfaces/users.repository';
import DeleteUserCommand from '../commands/delete.user.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly sessionsRepo: SessionsRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly banRepo: UsersBanRepository,
  ) { }

  public async execute(command: DeleteUserCommand): Promise<void> {
    const { userId } = command;
    const user = await this.usersRepo.get(userId);
    if (!user) throw new NotFoundException('user not found');

    await this.sessionsRepo.deleteAll(userId);
    await this.emailRepo.delete(userId);
    await this.banRepo.delete(userId);
    const deleted = await this.usersRepo.delete(userId);

    if (!deleted) throw new BadRequestException('cannot delete user');
  }
}
