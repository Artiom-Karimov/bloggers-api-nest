import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/user.error';
import UsersRepository from '../../../users/users.repository';
import RecoveryRepository from '../../../users/mongoose/recovery.repository';
import SetNewPasswordCommand from '../commands/set.new.password.command';

@CommandHandler(SetNewPasswordCommand)
export default class SetNewPasswordPasswordHandler
  implements ICommandHandler<SetNewPasswordCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly recoveryRepo: RecoveryRepository,
  ) { }

  public async execute(command: SetNewPasswordCommand): Promise<UserError> {
    const recovery = await this.recoveryRepo.getByCode(
      command.data.recoveryCode,
    );
    if (!recovery || recovery.expiresAt < new Date().getTime())
      return UserError.InvalidCode;

    await this.recoveryRepo.delete(recovery.userId);

    let user = await this.usersRepo.get(recovery.userId);
    if (!user) return UserError.NotFound;

    user = await user.updatePassword(command.data.newPassword);
    const updated = await this.usersRepo.update(user);

    return updated ? UserError.NoError : UserError.Unknown;
  }
}
