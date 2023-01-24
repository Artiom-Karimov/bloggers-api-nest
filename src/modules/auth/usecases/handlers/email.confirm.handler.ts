import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import EmailConfirmCommand from '../commands/email.confirm.command';
import { throwValidationException } from '../../../../common/utils/validation.options';

@CommandHandler(EmailConfirmCommand)
export default class EmailConfirmHandler
  implements ICommandHandler<EmailConfirmCommand>
{
  constructor(private readonly emailRepo: EmailConfirmationRepository) { }

  public async execute(command: EmailConfirmCommand): Promise<void> {
    const ec = await this.emailRepo.getByCode(command.code);

    try {
      ec.confirm();
      const result = await this.emailRepo.update(ec);
      if (!result) throw new Error();
    } catch (error) {
      throwValidationException('code', 'wrong or already confirmed code');
    }
  }
}
