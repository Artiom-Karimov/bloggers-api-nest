import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import UserModel from '../../../users/models/user.model';
import UsersRepository from '../../../users/users.repository';
import RegistrationService from '../../registration.service';
import RegisterCommand from '../commands/register.command';

@CommandHandler(RegisterCommand)
export default class RegisterHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly registerService: RegistrationService,
  ) { }

  public async execute(command: RegisterCommand): Promise<UserError> {
    const exists = await this.registerService.checkLoginEmailExists(
      command.data,
    );
    if (exists !== UserError.NoError) return exists;

    const user = await UserModel.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) return UserError.Unknown;

    const retrieved = await this.usersRepo.get(created);
    if (!retrieved) return UserError.Unknown;

    await this.registerService.createEmailConfirmation(retrieved);

    return UserError.NoError;
  }
}
