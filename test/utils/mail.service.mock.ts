import { MailService } from '../../src/modules/mail/mail.service';

export class MailServiceMock extends MailService {
  override async sendEmailConfirmation(user: UserModel, code: string) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
  override async sendPasswordRecovery(user: UserModel, code: string) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
