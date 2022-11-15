import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import UserModel from '../users/models/user.model';
import * as config from '../../config/email';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmailConfirmation(user: UserModel, code: string) {
    const url = `${config.confirmLink}?code=${code}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to bloogs! Confirm your Email',
      template: './confirmation',
      context: {
        userLogin: user.login,
        url,
      },
    });
  }

  async sendPasswordRecovery(user: UserModel, code: string) {
    const url = `${config.recoverLink}?recoveryCode=${code}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password recovery',
      template: './confirmation',
      context: {
        userLogin: user.login,
        url,
      },
    });
  }
}
