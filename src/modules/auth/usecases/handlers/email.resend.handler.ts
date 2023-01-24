import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import { UserError } from '../../../users/models/user.error';
import UsersRepository from '../../../users/interfaces/users.repository';
import EmailResendCommand from '../commands/email.resend.command';
import { User } from '../../../users/typeorm/models/user';
import { EmailConfirmation } from '../../../users/typeorm/models/email.confirmation';

@CommandHandler(EmailResendCommand)
export default class EmailResendHandler
  implements ICommandHandler<EmailResendCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly mailService: MailService,
  ) { }

  public async execute(command: EmailResendCommand): Promise<UserError> {
    const retrieved = await this.usersRepo.getByLoginOrEmail(command.email);
    if (!retrieved) return UserError.NotFound;

    const result = await this.createEmailConfirmation(retrieved);

    return result;
  }

  private async createEmailConfirmation(user: User): Promise<UserError> {
    const existing = await this.emailRepo.getByUser(user.id);
    if (existing?.isConfirmed) return UserError.AlreadyConfirmed;

    const ec = EmailConfirmation.create(user);

    if (existing) {
      await this.emailRepo.update(ec);
    } else await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.confirmationCode);

    return UserError.NoError;
  }
}
