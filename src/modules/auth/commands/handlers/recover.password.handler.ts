import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import { UserError } from '../../../users/user.error';
import UsersRepository from '../../../users/users.repository';
import RecoveryModel from '../../../users/models/recovery.model';
import RecoveryRepository from '../../../users/recovery.repository';
import RecoverPasswordCommand from '../commands/recover.password.command';

@CommandHandler(RecoverPasswordCommand)
export default class RecoverPasswordHandler
  implements ICommandHandler<RecoverPasswordCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly recoveryRepo: RecoveryRepository,
    private readonly mailService: MailService,
  ) { }

  public async execute(command: RecoverPasswordCommand): Promise<UserError> {
    const user = await this.usersRepo.getByLoginOrEmail(command.email);
    if (!user) return UserError.NotFound;

    const recovery = RecoveryModel.create(user.id);
    const created = await this.recoveryRepo.createOrUpdate(recovery);

    await this.mailService.sendPasswordRecovery(user, recovery.code);

    return created ? UserError.NoError : UserError.Unknown;
  }
}
