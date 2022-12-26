import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import { UserError } from '../../../users/user.error';
import EmailConfirmCommand from '../commands/email.confirm.command';

@CommandHandler(EmailConfirmCommand)
export default class EmailConfirmHandler
  implements ICommandHandler<EmailConfirmCommand>
{
  constructor(private readonly emailRepo: EmailConfirmationRepository) { }

  public async execute(command: EmailConfirmCommand): Promise<UserError> {
    const ec = await this.emailRepo.getByCode(command.code);

    try {
      ec.confirm();
      const result = await this.emailRepo.update(ec);
      return result ? UserError.NoError : UserError.Unknown;
    } catch (error) {
      return UserError.InvalidCode;
    }
  }
}
