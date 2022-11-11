import jwt from 'jsonwebtoken';
import * as config from '../../../../config/jwt';
import TokenPayload from './token.payload';

export default class TokenPair {
  constructor(public accessToken: string, public refreshToken: string) { }

  public static create(payload: TokenPayload): TokenPair {
    return new TokenPair(
      TokenPair.createAccess(payload.userId),
      TokenPair.createRefresh(payload),
    );
  }
  public static unpackAccessToken(token: string): string {
    try {
      const result: any = jwt.verify(token, config.secret);
      return result.userId;
    } catch (error) {
      return undefined;
    }
  }
  public static unpackRefreshToken(token: string): TokenPayload {
    try {
      const result: any = jwt.verify(token, config.secret);
      return {
        userId: result.userId,
        deviceId: result.deviceId,
        exp: result.exp,
      };
    } catch (error) {
      return undefined;
    }
  }

  private static createAccess(userId: string): string {
    return jwt.sign({ userId, exp: config.accessExpireSeconds }, config.secret);
  }
  private static createRefresh(payload: TokenPayload): string {
    return jwt.sign(payload, config.secret);
  }
}
