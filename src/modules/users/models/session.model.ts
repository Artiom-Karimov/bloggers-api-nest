import { Exception } from 'handlebars';
import IdGenerator from '../../../common/utils/id.generator';
import * as config from '../../../config/users';
import TokenPair from '../../auth/models/jwt/token.pair';

export type SessionCreateType = {
  ip: string;
  deviceName: string;
  userId: string;
  userLogin: string;
};

export default class SessionModel {
  constructor(
    public ip: string,
    public deviceId: string,
    public deviceName: string,
    public userId: string,
    public userLogin: string,
    public issuedAt: number,
    public expiresAt: number,
  ) { }

  public static create(data: SessionCreateType): SessionModel {
    return new SessionModel(
      data.ip,
      IdGenerator.generate(),
      data.deviceName,
      data.userId,
      data.userLogin,
      new Date().getTime(),
      new Date().getTime() + config.refreshExpireMillis,
    );
  }
  public refresh(ip: string, deviceName: string, userId: string): SessionModel {
    if (userId !== this.userId) throw new Exception('Wrong user id');
    if (!this.isValid()) throw new Exception('Session expired');

    this.ip = ip;
    this.deviceName = deviceName;
    this.issuedAt = new Date().getTime();
    this.expiresAt = new Date().getTime() + config.refreshExpireMillis;
    return this;
  }

  public isValid(): boolean {
    return this.expiresAt > new Date().getTime();
  }

  public getTokens(): TokenPair {
    return new TokenPair({
      userId: this.userId,
      userLogin: this.userLogin,
      deviceId: this.deviceId,
      issuedAt: this.issuedAt,
      exp: this.expiresAt,
    });
  }
}
