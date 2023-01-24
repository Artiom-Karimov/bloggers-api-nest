import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import { UserError } from '../../../users/models/user.error';
import UsersRepository from '../../../users/interfaces/users.repository';
import RecoveryRepository from '../../../users/interfaces/recovery.repository';
import RecoverPasswordCommand from '../commands/recover.password.command';
import { Recovery } from '../../../users/typeorm/models/recovery';

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

    const recovery = Recovery.create(user);
    const created = await this.recoveryRepo.createOrUpdate(recovery);

    await this.mailService.sendPasswordRecovery(user, recovery.code);

    return created ? UserError.NoError : UserError.Unknown;
  }
}
