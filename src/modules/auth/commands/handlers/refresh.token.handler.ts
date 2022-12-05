import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import TokenPair from '../../models/jwt/token.pair';
import SessionModel, {
  SessionCreateType,
} from '../../models/session/session.model';
import SessionsRepository from '../../sessions.repository';
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

    if (!(await this.checkSession(payload.deviceId, payload.userId)))
      return UserError.InvalidCode;

    const loginAllowed = await this.service.checkLoginAllowed(payload.userId);
    if (loginAllowed !== UserError.NoError) return loginAllowed;

    const session = await this.updateSession(payload.deviceId, {
      ip,
      deviceName,
      userId: payload.userId,
    });
    return this.service.createTokenPair(session, payload.userLogin);
  }
  private async checkSession(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const session = await this.sessionsRepo.get(deviceId);
    if (!session) return false;

    if (session.expiresAt < new Date().getTime()) return false;
    if (session.userId !== userId) return false;

    return true;
  }
  private async updateSession(sessionId: string, data: SessionCreateType) {
    const session = SessionModel.refresh(sessionId, data);
    await this.sessionsRepo.update(sessionId, session);
    return session;
  }
}
