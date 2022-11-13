import jwt from 'jsonwebtoken';
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
      const result: any = jwt.verify(token, config.jwtSecret);
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
    exp += config.accessExpireMinutes * 60_000;
    exp /= 1000;

    return jwt.sign({ ...payload, exp }, config.jwtSecret);
  }
  private static createRefresh(payload: TokenPayload): string {
    return jwt.sign({ ...payload, exp: payload.exp / 1000 }, config.jwtSecret);
  }
}
