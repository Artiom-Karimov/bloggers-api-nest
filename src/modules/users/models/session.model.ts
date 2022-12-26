import { Exception } from 'handlebars';
import IdGenerator from '../../../common/utils/id.generator';
import * as config from '../../../config/users';
import TokenPair from '../../auth/models/jwt/token.pair';
import { SessionDto } from './dto/session.dto';

export type SessionCreateType = {
  ip: string;
  deviceName: string;
  userId: string;
  userLogin: string;
};

export default class SessionModel {
  private _ip: string;
  private _deviceId: string;
  private _deviceName: string;
  private _userId: string;
  private _userLogin: string;
  private _issuedAt: Date;
  private _expiresAt: Date;

  constructor(data: SessionDto) {
    this._ip = data.ip;
    this._deviceId = data.deviceId;
    this._deviceName = data.deviceName;
    this._userId = data.userId;
    this._userLogin = data.userLogin;
    this._issuedAt = data.issuedAt;
    this._expiresAt = data.expiresAt;
  }
  public toDto(): SessionDto {
    return new SessionDto(
      this._deviceId,
      this._deviceName,
      this._ip,
      this._userId,
      this._userLogin,
      this._issuedAt,
      this._expiresAt,
    );
  }

  public static create(data: SessionCreateType): SessionModel {
    return new SessionModel(
      new SessionDto(
        data.ip,
        IdGenerator.generate(),
        data.deviceName,
        data.userId,
        data.userLogin,
        new Date(),
        new Date(Date.now() + config.refreshExpireMillis),
      ),
    );
  }

  get userId(): string {
    return this._userId;
  }
  get issuedAt(): number {
    return this._issuedAt.getTime();
  }

  public refresh(ip: string, deviceName: string, userId: string): SessionModel {
    if (userId !== this._userId) throw new Exception('Wrong user id');
    if (!this.isValid()) throw new Exception('Session expired');

    this._ip = ip;
    this._deviceName = deviceName;
    this._issuedAt = new Date();
    this._expiresAt = new Date(Date.now() + config.refreshExpireMillis);
    return this;
  }

  public isValid(): boolean {
    return this._expiresAt > new Date();
  }

  public getTokens(): TokenPair {
    return new TokenPair({
      userId: this._userId,
      userLogin: this._userLogin,
      deviceId: this._deviceId,
      issuedAt: this._issuedAt.getTime(),
      exp: this._expiresAt.getTime(),
    });
  }
}
