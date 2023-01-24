import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import UsersRepository from '../../../users/interfaces/users.repository';
import RecoveryRepository from '../../../users/interfaces/recovery.repository';
import SetNewPasswordCommand from '../commands/set.new.password.command';
import { throwValidationException } from '../../../../common/utils/validation.options';

@CommandHandler(SetNewPasswordCommand)
export default class SetNewPasswordPasswordHandler
  implements ICommandHandler<SetNewPasswordCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly recoveryRepo: RecoveryRepository,
  ) { }

  public async execute(command: SetNewPasswordCommand): Promise<void> {
    const recovery = await this.recoveryRepo.getByCode(
      command.data.recoveryCode,
    );
    if (!recovery || recovery.isExpired)
      throwValidationException('recoveryCode', 'wrong or outdated code');

    await this.recoveryRepo.delete(recovery.userId);

    let user = await this.usersRepo.get(recovery.userId);
    if (!user) throwValidationException('recoveryCode', 'user not found');

    user = await user.updatePassword(command.data.newPassword);
    const updated = await this.usersRepo.update(user);

    if (!updated)
      throwValidationException('recoveryCode', 'cannot set new password');
  }
}
