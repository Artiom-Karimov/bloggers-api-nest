import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import TokenPair from '../../models/jwt/token.pair';
import SessionsService from '../../sessions.service';
import LogoutCommand from '../commands/logout.command';

@CommandHandler(LogoutCommand)
export default class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly service: SessionsService) { }

  public async execute(command: LogoutCommand): Promise<TokenPair | UserError> {
    const payload = TokenPair.unpackToken(command.refreshToken);
    if (!payload) return UserError.InvalidCode;

    const result = await this.service.deleteOne(
      payload.userId,
      payload.deviceId,
    );
    return result;
  }
}
