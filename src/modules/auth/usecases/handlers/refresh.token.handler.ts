import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import TokenPair from '../../models/jwt/token.pair';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import SessionsService from '../../sessions.service';
import RefreshTokenCommand from '../commands/refresh.token.command';

@CommandHandler(RefreshTokenCommand)
export default class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly service: SessionsService,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  public async execute(
    command: RefreshTokenCommand,
  ): Promise<TokenPair | UserError> {
    const { token, ip, deviceName } = command.data;

    const payload = TokenPair.unpackToken(token);
    if (!payload) return UserError.InvalidCode;

    const loginAllowed = await this.service.checkLoginAllowed(payload.userId);
    if (loginAllowed !== UserError.NoError) return loginAllowed;

    const session = await this.sessionsRepo.get(payload.deviceId);
    if (!session) return UserError.InvalidCode;

    try {
      session.refresh(ip, deviceName, payload.userId);
    } catch (error) {
      return UserError.InvalidCode;
    }

    const updated = this.sessionsRepo.update(session);
    if (!updated) return UserError.Unknown;

    return session.getTokens();
  }
}
