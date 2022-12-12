import { sign, verify } from 'jsonwebtoken';
import * as config from '../../../../config/users';
import TokenPayload from './token.payload';

export default class TokenPair {
  public accessToken: string;
  public refreshToken: string;

  constructor(payload: TokenPayload) {
    this.createAccess(payload);
    this.createRefresh(payload);
  }

  public static unpackToken(token: string): TokenPayload {
    try {
      const result: any = verify(token, config.jwtSecret);
      return {
        userId: result.userId,
        userLogin: result.userLogin,
        deviceId: result.deviceId,
        issuedAt: result.issuedAt,
        exp: result.exp,
      };
    } catch (error) {
      return undefined;
    }
  }

  private createAccess(payload: TokenPayload) {
    let exp = new Date().getTime();
    exp += config.accessExpireMillis;

    this.accessToken = this.sign(payload, exp);
  }
  private createRefresh(payload: TokenPayload) {
    this.refreshToken = this.sign(payload);
  }
  private sign(payload: TokenPayload, exp: number = payload.exp): string {
    exp = Math.floor(exp / 1000);
    return sign({ ...payload, exp }, config.jwtSecret);
  }
}
