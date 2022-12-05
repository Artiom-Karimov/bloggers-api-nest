import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import SessionsRepository from '../../sessions.repository';
import LogoutAnotherSessionsCommand from '../commands/logout.another.sessions.command';

@CommandHandler(LogoutAnotherSessionsCommand)
export default class LogoutAnotherSessionsHandler
  implements ICommandHandler<LogoutAnotherSessionsCommand>
{
  constructor(private readonly sessionsRepo: SessionsRepository) { }

  public async execute(
    command: LogoutAnotherSessionsCommand,
  ): Promise<UserError> {
    await this.sessionsRepo.deleteAllButOne(command.userId, command.deviceId);
    return UserError.NoError;
  }
}
