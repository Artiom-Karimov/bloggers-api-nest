import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import EmailConfirmationModel from '../users/models/email/email.confirmation.model';
import UserInputModel from '../users/models/user.input.model';
import UsersBanRepository from '../users/users.ban.repository';
import UsersService from '../users/users.service';
import { AuthError } from './models/auth.error';
import EmailInputModel from './models/input/email.input.model';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly banRepo: UsersBanRepository,
    private readonly emailRepo: EmailConfirmationRepository,
  ) { }

  public async register(data: UserInputModel): Promise<AuthError> {
    if (await this.usersService.loginOrEmailExists(data.login))
      return AuthError.LoginExists;
    if (await this.usersService.loginOrEmailExists(data.email))
      return AuthError.EmailExists;

    const created = await this.usersService.create(data);
    if (!created) return AuthError.Unknown;

    const emailSent = await this.createEmailConfirmation(created);

    return emailSent ? AuthError.NoError : AuthError.AlreadyConfirmed;
  }

  public async resendEmail(email: string): Promise<AuthError> {
    const user = await this.usersService.getByLoginOrEmail(email);
    if (!user) return AuthError.WrongCredentials;

    const emailSent = await this.createEmailConfirmation(user.id);
    return emailSent ? AuthError.NoError : AuthError.AlreadyConfirmed;
  }
  public async confirmEmail(code: string): Promise<boolean> {
    const ec = await this.emailRepo.getByCode(code);
    if (!ec || ec.expiration > new Date().getTime()) return false;
  }

  private async createEmailConfirmation(userId: string) {
    const ec = EmailConfirmationModel.create(userId);
    const existing = await this.emailRepo.getByUser(userId);

    if (existing) {
      if (existing.confirmed) return false;
      await this.emailRepo.update(ec);
    } else await this.emailRepo.create(ec);

    // Send email
  }
}
