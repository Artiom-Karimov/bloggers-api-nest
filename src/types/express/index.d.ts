import TokenPayload from '../../modules/auth/models/jwt/token.payload';

export { };

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
      refreshToken?: string;
    }
  }
}