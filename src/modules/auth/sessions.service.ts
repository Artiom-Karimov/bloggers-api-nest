import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/interfaces/email.confirmation.repository';
import UsersBanQueryRepository from '../users/interfaces/users.ban.query.repository';

@Injectable()
export default class SessionsService {
  constructor(
    private readonly banRepo: UsersBanQueryRepository,
    private readonly emailRepo: EmailConfirmationRepository,
  ) { }

  public async checkLoginAllowed(id: string): Promise<boolean> {
    const ec = await this.emailRepo.getByUser(id);
    if (!ec || !ec.isConfirmed) return false;
    const ban = await this.banRepo.get(id);
    return ban === undefined || !ban.isBanned;
  }
}
