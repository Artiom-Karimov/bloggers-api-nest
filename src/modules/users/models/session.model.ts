import IdGenerator from '../../../common/utils/id.generator';
import * as config from '../../../config/users';

export type SessionCreateType = {
  ip: string;
  deviceName: string;
  userId: string;
};

export default class SessionModel {
  constructor(
    public ip: string,
    public deviceId: string,
    public deviceName: string,
    public userId: string,
    public issuedAt: number,
    public expiresAt: number,
  ) { }
  public static create(data: SessionCreateType): SessionModel {
    return new SessionModel(
      data.ip,
      IdGenerator.generate(),
      data.deviceName,
      data.userId,
      new Date().getTime(),
      new Date().getTime() + config.refreshExpireMillis,
    );
  }
  public static refresh(id: string, data: SessionCreateType): SessionModel {
    return new SessionModel(
      data.ip,
      id,
      data.deviceName,
      data.userId,
      new Date().getTime(),
      new Date().getTime() + config.refreshExpireMillis,
    );
  }
}
