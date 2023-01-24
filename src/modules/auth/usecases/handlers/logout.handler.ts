import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import TokenPair from '../../models/jwt/token.pair';
import DeleteSessionCommand from '../commands/delete.session.command';
import LogoutCommand from '../commands/logout.command';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@CommandHandler(LogoutCommand)
export default class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly commandBus: CommandBus) { }

  public async execute(command: LogoutCommand): Promise<void> {
    const ex = new UnauthorizedException('invalid or expired token');

    const payload = TokenPair.unpackToken(command.refreshToken);
    if (!payload) throw ex;

    try {
      await this.commandBus.execute(
        new DeleteSessionCommand(payload.userId, payload.deviceId),
      );
    } catch (error) {
      throw ex;
    }
  }
}
