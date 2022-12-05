import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../../users/email.confirmation.repository';
import EmailConfirmationModel from '../../../users/models/email/email.confirmation.model';
import { UserError } from '../../../users/models/user.error';
import EmailConfirmCommand from '../commands/email.confirm.command';

@CommandHandler(EmailConfirmCommand)
export default class EmailConfirmHandler
  implements ICommandHandler<EmailConfirmCommand>
{
  constructor(private readonly emailRepo: EmailConfirmationRepository) { }

  public async execute(command: EmailConfirmCommand): Promise<UserError> {
    let ec = await this.emailRepo.getByCode(command.code);
    if (!ec || ec.expiration < new Date().getTime())
      return UserError.InvalidCode;
    if (ec.confirmed) return UserError.AlreadyConfirmed;

    ec = EmailConfirmationModel.setConfirmed(ec);
    const result = await this.emailRepo.update(ec);

    return result ? UserError.NoError : UserError.Unknown;
  }
}
