import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/mongoose/email.confirmation.repository';
import { UserError } from '../users/user.error';
import TokenPair from './models/jwt/token.pair';
import TokenPayload from './models/jwt/token.payload';
import SessionModel from './models/session/session.model';
import UsersBanQueryRepository from '../users/mongoose/users.ban.query.repository';

@Injectable()
export default class SessionsService {
  constructor(
    private readonly banRepo: UsersBanQueryRepository,
    private readonly emailRepo: EmailConfirmationRepository,
  ) { }

  public async checkLoginAllowed(id: string): Promise<UserError> {
    const ec = await this.emailRepo.getByUser(id);
    if (!ec || !ec.confirmed) return UserError.Unconfirmed;
    const ban = await this.banRepo.get(id);
    if (ban === undefined || !ban.isBanned) return UserError.NoError;
    return UserError.Forbidden;
  }
  public createTokenPair(session: SessionModel, userLogin: string): TokenPair {
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
}
