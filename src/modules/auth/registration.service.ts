import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import EmailConfirmationModel from '../users/models/email/email.confirmation.model';
import { UserError } from '../users/models/user.error';
import UserInputModel from '../users/models/user.input.model';
import UserModel from '../users/models/user.model';
import UsersRepository from '../users/users.repository';

@Injectable()
export default class RegistrationService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly mailService: MailService,
  ) { }

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
