import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import LogoutAnotherSessionsCommand from '../commands/logout.another.sessions.command';

@CommandHandler(LogoutAnotherSessionsCommand)
export default class LogoutAnotherSessionsHandler
  implements ICommandHandler<LogoutAnotherSessionsCommand>
{
  constructor(private readonly sessionsRepo: SessionsRepository) { }

  public async execute(command: LogoutAnotherSessionsCommand): Promise<void> {
    await this.sessionsRepo.deleteAllButOne(command.userId, command.deviceId);
  }
}
