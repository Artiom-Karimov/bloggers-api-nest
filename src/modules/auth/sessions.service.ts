import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/interfaces/email.confirmation.repository';
import { UserError } from '../users/user.error';
import UsersBanQueryRepository from '../users/interfaces/users.ban.query.repository';

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
}
