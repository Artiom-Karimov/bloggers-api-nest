import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import TokenPair from '../../models/jwt/token.pair';
import DeleteSessionCommand from '../commands/delete.session.command';
import LogoutCommand from '../commands/logout.command';

@CommandHandler(LogoutCommand)
export default class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly commandBus: CommandBus) { }

  public async execute(command: LogoutCommand): Promise<UserError> {
    const payload = TokenPair.unpackToken(command.refreshToken);
    if (!payload) return UserError.InvalidCode;

    return this.commandBus.execute(
      new DeleteSessionCommand(payload.userId, payload.deviceId),
    );
  }
}
