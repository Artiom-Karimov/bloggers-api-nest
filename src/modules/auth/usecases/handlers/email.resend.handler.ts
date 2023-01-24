import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import UsersRepository from '../../../users/interfaces/users.repository';
import EmailResendCommand from '../commands/email.resend.command';
import { User } from '../../../users/typeorm/models/user';
import { EmailConfirmation } from '../../../users/typeorm/models/email.confirmation';
import { throwValidationException } from '../../../../common/utils/validation.options';

@CommandHandler(EmailResendCommand)
export default class EmailResendHandler
  implements ICommandHandler<EmailResendCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly mailService: MailService,
  ) { }

  public async execute(command: EmailResendCommand): Promise<void> {
    const retrieved = await this.usersRepo.getByLoginOrEmail(command.email);
    if (!retrieved)
      throwValidationException('email', 'email is wrong or already confirmed');

    const result = await this.createEmailConfirmation(retrieved);

    return result;
  }

  private async createEmailConfirmation(user: User): Promise<void> {
    const existing = await this.emailRepo.getByUser(user.id);
    if (existing?.isConfirmed)
      throwValidationException('email', 'email is wrong or already confirmed');

    const ec = EmailConfirmation.create(user);

    if (existing) {
      await this.emailRepo.update(ec);
    } else await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.confirmationCode);
  }
}
