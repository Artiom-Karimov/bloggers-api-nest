import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import TokenPair from '../../models/jwt/token.pair';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import SessionsService from '../../sessions.service';
import RefreshTokenCommand from '../commands/refresh.token.command';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@CommandHandler(RefreshTokenCommand)
export default class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly service: SessionsService,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  public async execute(command: RefreshTokenCommand): Promise<TokenPair> {
    const { token, ip, deviceName } = command.data;
    const ex = new UnauthorizedException('invalid or expired token');

    const payload = TokenPair.unpackToken(token);
    if (!payload) throw ex;

    const loginAllowed = await this.service.checkLoginAllowed(payload.userId);
    if (!loginAllowed) throw ex;

    const session = await this.sessionsRepo.get(payload.deviceId);
    if (!session) throw ex;

    try {
      session.refresh(ip, deviceName, payload.userId);
    } catch (error) {
      throw ex;
    }

    const updated = this.sessionsRepo.update(session);
    if (!updated) throw ex;

    return session.getTokens();
  }
}
