import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import { UserError } from '../users/models/user.error';
import UsersRepository from '../users/users.repository';
import TokenPair from './models/jwt/token.pair';
import TokenPayload from './models/jwt/token.payload';
import SessionUserViewModel from './models/session.user.view.model';
import SessionModel from './models/session/session.model';
import UsersBanQueryRepository from './users.ban.query.repository';

@Injectable()
export default class SessionsService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly banRepo: UsersBanQueryRepository,
    private readonly emailRepo: EmailConfirmationRepository,
  ) { }

  public async getSessionUserView(
    userId: string,
  ): Promise<SessionUserViewModel> {
    const user = await this.usersRepo.get(userId);
    if (!user) return undefined;

    return SessionUserViewModel.fromDomain(user);
  }

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
