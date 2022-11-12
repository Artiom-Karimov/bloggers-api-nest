import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import UserModel from '../users/models/user.model';
import UsersBanRepository from '../users/users.ban.repository';
import UsersService from '../users/users.service';
import { AuthError } from './models/auth.error';
import LoginInputModel from './models/input/login.input.model';
import RefreshTokenInputModel from './models/input/refresh.token.input.model';
import TokenPair from './models/jwt/token.pair';
import TokenPayload from './models/jwt/token.payload';
import SessionUserViewModel from './models/session.user.view.model';
import SessionModel from './models/session/session.model';
import SessionsRepository from './sessions.repository';

@Injectable()
export default class SessionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly banRepo: UsersBanRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly sessionsRepo: SessionsRepository,
  ) { }
  public async login(data: LoginInputModel): Promise<TokenPair | AuthError> {
    const userResult = await this.checkLoginGetUser(data.login, data.password);
    if (!(userResult instanceof UserModel)) return userResult;

    const session = await this.createSession(
      data.ip,
      data.deviceName,
      userResult.id,
    );
    return this.createTokenPair(session);
  }
  public async refreshToken(
    data: RefreshTokenInputModel,
  ): Promise<TokenPair | AuthError> {
    const payload = TokenPair.unpackRefreshToken(data.token);
    if (!payload) return AuthError.InvalidCode;

    if (!(await this.checkAndDeleteSession(payload.deviceId, payload.userId)))
      return AuthError.InvalidCode;

    const loginAllowed = await this.checkLoginAllowed(payload.userId);
    if (loginAllowed !== AuthError.NoError) return loginAllowed;

    const session = await this.createSession(
      data.ip,
      data.deviceName,
      payload.userId,
    );
    return this.createTokenPair(session);
  }
  public async logout(refreshToken: string): Promise<boolean> {
    const payload = TokenPair.unpackRefreshToken(refreshToken);
    if (!payload) return false;

    const result = await this.checkAndDeleteSession(
      payload.deviceId,
      payload.userId,
    );

    return result;
  }
  public async getSessionUserView(
    refreshToken: string,
  ): Promise<SessionUserViewModel> {
    const payload = TokenPair.unpackRefreshToken(refreshToken);
    if (!payload) return undefined;

    const user = await this.usersService.get(payload.userId);
    if (!user) return undefined;

    return SessionUserViewModel.fromDomain(user);
  }

  private async checkLoginGetUser(
    login: string,
    password: string,
  ): Promise<UserModel | AuthError> {
    const user = await this.usersService.getByLoginOrEmail(login);
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
  private async createSession(
    ip: string,
    deviceName: string,
    userId: string,
  ): Promise<SessionModel> {
    const session = SessionModel.create({
      ip: ip,
      deviceName: deviceName,
      userId,
    });
    await this.sessionsRepo.create(session);
    return session;
  }
  private createTokenPair(session: SessionModel): TokenPair {
    return TokenPair.create(
      new TokenPayload(session.userId, session.deviceId, session.expiresAt),
    );
  }
  private async checkAndDeleteSession(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const session = await this.sessionsRepo.get(deviceId);
    if (!session) return false;

    await this.sessionsRepo.delete(deviceId);
    if (session.expiresAt < new Date().getTime()) return false;
    if (session.userId !== userId) return false;

    return true;
  }
}
