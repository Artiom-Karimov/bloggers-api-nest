import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import UserModel from '../users/models/user.model';
import UsersRepository from '../users/users.repository';
import { AuthError } from './models/auth.error';
import LoginInputModel from './models/input/login.input.model';
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
  public async login(data: LoginInputModel): Promise<TokenPair | AuthError> {
    const userResult = await this.checkLoginGetUser(
      data.loginOrEmail,
      data.password,
    );
    if (!(userResult instanceof UserModel)) return userResult;

    const session = await this.createSession({
      ip: data.ip,
      deviceName: data.deviceName,
      userId: userResult.id,
    });
    return this.createTokenPair(session, userResult.login);
  }
  public async refreshToken(
    data: RefreshTokenInputModel,
  ): Promise<TokenPair | AuthError> {
    const payload = TokenPair.unpackToken(data.token);
    if (!payload) return AuthError.InvalidCode;

    if (!(await this.checkSession(payload.deviceId, payload.userId)))
      return AuthError.InvalidCode;

    const loginAllowed = await this.checkLoginAllowed(payload.userId);
    if (loginAllowed !== AuthError.NoError) return loginAllowed;

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
    return result === AuthError.NoError;
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
  public async deleteOne(userId: string, deviceId: string): Promise<AuthError> {
    const session = await this.sessionsRepo.get(deviceId);
    if (!session) return AuthError.NotFound;
    if (session.userId !== userId) return AuthError.WrongCredentials;
    await this.sessionsRepo.delete(deviceId);
    return AuthError.NoError;
  }
  public async get(deviceId: string): Promise<SessionModel> {
    return this.sessionsRepo.get(deviceId);
  }

  private async checkLoginGetUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserModel | AuthError> {
    const user = await this.usersRepo.getByLoginOrEmail(loginOrEmail);
    if (!user) return AuthError.WrongCredentials;

    const loginAllowed = await this.checkLoginAllowed(user.id);
    if (loginAllowed !== AuthError.NoError) return loginAllowed;

    const passwordMatch = await UserModel.checkPassword(user, password);
    if (!passwordMatch) return AuthError.WrongCredentials;

    return user;
  }
  private async checkLoginAllowed(id: string): Promise<AuthError> {
    const ec = await this.emailRepo.getByUser(id);
    if (!ec || !ec.confirmed) return AuthError.Unconfirmed;
    const ban = await this.banRepo.get(id);
    if (ban === undefined || !ban.isBanned) return AuthError.NoError;
    return AuthError.Banned;
  }
  private async createSession(data: SessionCreateType): Promise<SessionModel> {
    const session = SessionModel.create(data);
    await this.sessionsRepo.create(session);
    return session;
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
