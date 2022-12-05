import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import EmailConfirmationModel from '../users/models/email/email.confirmation.model';
import { UserError } from '../users/models/user.error';
import UserInputModel from '../users/models/user.input.model';
import UserModel from '../users/models/user.model';
import UsersRepository from '../users/users.repository';
import NewPasswordInputModel from './models/input/new.password.input.model';
import RecoveryModel from './models/recovery/recovery.model';
import RecoveryRepository from './recovery.repository';

@Injectable()
export default class RegistrationService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly recoveryRepo: RecoveryRepository,
    private readonly mailService: MailService,
  ) { }

  public async confirmEmail(code: string): Promise<boolean> {
    let ec = await this.emailRepo.getByCode(code);
    if (!ec || ec.expiration < new Date().getTime() || ec.confirmed)
      return false;

    ec = EmailConfirmationModel.setConfirmed(ec);
    return this.emailRepo.update(ec);
  }

  public async recoverPassword(email: string): Promise<boolean> {
    const user = await this.usersRepo.getByLoginOrEmail(email);
    if (!user) return false;

    const recovery = RecoveryModel.create(user.id);
    await this.recoveryRepo.createOrUpdate(recovery);

    await this.mailService.sendPasswordRecovery(user, recovery.code);

    return true;
  }

  public async setNewPassword(data: NewPasswordInputModel): Promise<boolean> {
    const recovery = await this.recoveryRepo.getByCode(data.recoveryCode);
    if (!recovery || recovery.expiresAt < new Date().getTime()) return false;
    await this.recoveryRepo.delete(recovery.userId);

    let user = await this.usersRepo.get(recovery.userId);
    if (!user) return false;

    user = await UserModel.updatePassword(user, data.newPassword);
    return this.usersRepo.update(user.id, user);
  }

  public async checkLoginEmailExists(data: UserInputModel): Promise<UserError> {
    const loginExists = await this.usersRepo.getByLoginOrEmail(data.login);
    if (loginExists) return UserError.LoginExists;
    const emailExists = await this.usersRepo.getByLoginOrEmail(data.email);
    if (emailExists) return UserError.EmailExists;

    return UserError.NoError;
  }

  public async createEmailConfirmation(user: UserModel): Promise<boolean> {
    const ec = EmailConfirmationModel.create(user.id);
    const existing = await this.emailRepo.getByUser(user.id);

    if (existing) {
      if (existing.confirmed) return false;
      await this.emailRepo.update(ec);
    } else await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.code);
    return true;
  }
}
