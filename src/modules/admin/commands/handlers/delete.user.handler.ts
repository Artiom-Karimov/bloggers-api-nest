import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../../users/sessions.repository';
import EmailConfirmationRepository from '../../../users/email.confirmation.repository';
import { UserError } from '../../../users/user.error';
import UsersBanRepository from '../../../users/users.ban.repository';
import UsersRepository from '../../../users/users.repository';
import DeleteUserCommand from '../commands/delete.user.command';

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

  public async execute(command: DeleteUserCommand): Promise<UserError> {
    const { userId } = command;
    const user = await this.usersRepo.get(userId);
    if (!user) return UserError.NotFound;

    await this.sessionsRepo.deleteAll(userId);
    await this.emailRepo.delete(userId);
    await this.banRepo.delete(userId);
    const deleted = await this.usersRepo.delete(userId);

    return deleted ? UserError.NoError : UserError.Unknown;
  }
}
