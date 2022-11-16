import { sign, verify } from 'jsonwebtoken';
import * as config from '../../../../config/users';
import TokenPayload from './token.payload';

export default class TokenPair {
  constructor(public accessToken: string, public refreshToken: string) { }

  public static create(payload: TokenPayload): TokenPair {
    return new TokenPair(
      TokenPair.createAccess(payload),
      TokenPair.createRefresh(payload),
    );
  }
  public static unpackToken(token: string): TokenPayload {
    try {
      const result: any = verify(token, config.jwtSecret);
      return {
        userId: result.userId,
        userLogin: result.userLogin,
        deviceId: result.deviceId,
        exp: result.exp,
      };
    } catch (error) {
      return undefined;
    }
  }

  private static createAccess(payload: TokenPayload): string {
    let exp = new Date().getTime();
    exp += config.accessExpireMillis;

    return TokenPair.sign(payload, exp);
  }
  private static createRefresh(payload: TokenPayload): string {
    return TokenPair.sign(payload);
  }
  private static sign(
    payload: TokenPayload,
    exp: number = payload.exp,
  ): string {
    exp = Math.floor(exp / 1000);
    return sign({ ...payload, exp }, config.jwtSecret);
  }
}
