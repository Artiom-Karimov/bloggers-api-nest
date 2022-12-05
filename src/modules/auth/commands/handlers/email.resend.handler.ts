import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import UsersRepository from '../../../users/users.repository';
import RegistrationService from '../../registration.service';
import EmailResendCommand from '../commands/email.resend.command';

@CommandHandler(EmailResendCommand)
export default class EmailResendHandler
  implements ICommandHandler<EmailResendCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly registerService: RegistrationService,
  ) { }

  public async execute(command: EmailResendCommand): Promise<UserError> {
    const retrieved = await this.usersRepo.getByLoginOrEmail(command.email);
    if (!retrieved) return UserError.NotFound;

    const result = await this.registerService.createEmailConfirmation(
      retrieved,
    );

    return result ? UserError.NoError : UserError.AlreadyConfirmed;
  }
}
