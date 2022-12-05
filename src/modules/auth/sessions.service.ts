import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import { UserError } from '../users/models/user.error';
import UsersRepository from '../users/users.repository';
import RefreshTokenInputModel from './models/input/refresh.token.input.model';
import TokenPair from './models/jwt/token.pair';
import TokenPayload from './models/jwt/token.payload';
import SessionUserViewModel from './models/session.user.view.model';
import SessionModel, {
  SessionCreateType,
} from './models/session/session.model';
import SessionsRepository from './sessions.repository';
import UsersBanQueryRepository from './users.ban.query.repository';

@Injectable()
export default class SessionsService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly banRepo: UsersBanQueryRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  public async refreshToken(
    data: RefreshTokenInputModel,
  ): Promise<TokenPair | UserError> {
    const payload = TokenPair.unpackToken(data.token);
    if (!payload) return UserError.InvalidCode;

    if (!(await this.checkSession(payload.deviceId, payload.userId)))
      return UserError.InvalidCode;

    const loginAllowed = await this.checkLoginAllowed(payload.userId);
    if (loginAllowed !== UserError.NoError) return loginAllowed;

    const session = await this.updateSession(payload.deviceId, {
      ip: data.ip,
      deviceName: data.deviceName,
      userId: payload.userId,
    });
    return this.createTokenPair(session, payload.userLogin);
  }
  public async logout(refreshToken: string): Promise<boolean> {
    const payload = TokenPair.unpackToken(refreshToken);
    if (!payload) return false;

    const result = await this.deleteOne(payload.userId, payload.deviceId);
    return result === UserError.NoError;
  }
  public async getSessionUserView(
    userId: string,
  ): Promise<SessionUserViewModel> {
    const user = await this.usersRepo.get(userId);
    if (!user) return undefined;

    return SessionUserViewModel.fromDomain(user);
  }
  public async deleteAllButOne(
    userId: string,
    deviceId: string,
  ): Promise<number> {
    return this.sessionsRepo.deleteAllButOne(userId, deviceId);
  }
  public async deleteOne(userId: string, deviceId: string): Promise<UserError> {
    const session = await this.sessionsRepo.get(deviceId);
    if (!session) return UserError.NotFound;
    if (session.userId !== userId) return UserError.WrongCredentials;
    await this.sessionsRepo.delete(deviceId);
    return UserError.NoError;
  }
  public async get(deviceId: string): Promise<SessionModel> {
    return this.sessionsRepo.get(deviceId);
  }

  public async checkLoginAllowed(id: string): Promise<UserError> {
    const ec = await this.emailRepo.getByUser(id);
    if (!ec || !ec.confirmed) return UserError.Unconfirmed;
    const ban = await this.banRepo.get(id);
    if (ban === undefined || !ban.isBanned) return UserError.NoError;
    return UserError.Forbidden;
  }
  private async updateSession(sessionId: string, data: SessionCreateType) {
    const session = SessionModel.refresh(sessionId, data);
    await this.sessionsRepo.update(sessionId, session);
    return session;
  }
  private createTokenPair(session: SessionModel, userLogin: string): TokenPair {
    return TokenPair.create(
      new TokenPayload(
        session.userId,
        userLogin,
        session.deviceId,
        session.issuedAt,
        session.expiresAt,
      ),
    );
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
}
