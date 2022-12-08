import { MailService } from '../../src/modules/mail/mail.service';
import UserModel from '../../src/modules/users/models/user.model';

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
