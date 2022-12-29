import { MailService } from '../../src/modules/mail/mail.service';
import { User } from '../../src/modules/users/typeorm/models/user';

export class MailServiceMock extends MailService {
  override async sendEmailConfirmation(user: User, code: string) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
  override async sendPasswordRecovery(user: User, code: string) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
