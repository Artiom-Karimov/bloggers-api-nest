import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import EmailConfirmationModel from '../../../users/models/email.confirmation.model';
import { UserError } from '../../../users/user.error';
import UserModel from '../../../users/models/user.model';
import UsersRepository from '../../../users/interfaces/users.repository';
import EmailResendCommand from '../commands/email.resend.command';

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

  private async createEmailConfirmation(user: UserModel): Promise<UserError> {
    const existing = await this.emailRepo.getByUser(user.id);
    if (existing?.isConfirmed) return UserError.AlreadyConfirmed;

    const ec = EmailConfirmationModel.create(user.id);

    if (existing) {
      await this.emailRepo.update(ec);
    } else await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.confirmationCode);

    return UserError.NoError;
  }
}
