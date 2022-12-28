import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import DeleteSessionCommand from '../commands/delete.session.command';

@CommandHandler(DeleteSessionCommand)
export default class DeleteSessionHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private readonly sessionsRepo: SessionsRepository) { }

  public async execute(command: DeleteSessionCommand): Promise<UserError> {
    const session = await this.sessionsRepo.get(command.deviceId);
    if (!session) return UserError.NotFound;
    if (session.userId !== command.userId) return UserError.WrongCredentials;
    await this.sessionsRepo.delete(command.deviceId);
    return UserError.NoError;
  }
}
