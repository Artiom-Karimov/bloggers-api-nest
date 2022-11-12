import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import EmailConfirmationModel from '../users/models/email/email.confirmation.model';
import UserInputModel from '../users/models/user.input.model';
import UsersService from '../users/users.service';
import { AuthError } from './models/auth.error';
import NewPasswordInputModel from './models/input/new.password.input.model';
import RecoveryModel from './models/recovery/recovery.model';
import RecoveryRepository from './recovery.repository';

@Injectable()
export default class RegistrationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly recoveryRepo: RecoveryRepository,
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
    let ec = await this.emailRepo.getByCode(code);
    if (!ec || ec.expiration > new Date().getTime() || ec.confirmed)
      return false;

    ec = EmailConfirmationModel.setConfirmed(ec);
    return this.emailRepo.update(ec);
  }

  public async recoverPassword(email: string): Promise<boolean> {
    const user = await this.usersService.getByLoginOrEmail(email);
    if (!user) return false;

    const recovery = RecoveryModel.create(user.id);
    await this.recoveryRepo.createOrUpdate(recovery);

    // Send email

    return true;
  }

  public async setNewPassword(data: NewPasswordInputModel): Promise<boolean> {
    const recovery = await this.recoveryRepo.getByCode(data.recoveryCode);
    if (!recovery || recovery.expiresAt > new Date().getTime()) return false;
    await this.recoveryRepo.delete(recovery.userId);

    return this.usersService.updatePassword(recovery.userId, data.newPassword);
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
