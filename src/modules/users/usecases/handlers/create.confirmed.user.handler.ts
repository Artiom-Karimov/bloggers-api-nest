import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../interfaces/email.confirmation.repository';
import { UserError } from '../../models/user.error';
import UserInputModel from '../../models/input/user.input.model';
import UsersRepository from '../../interfaces/users.repository';
import CreateConfirmedUserCommand from '../commands/create.confirmed.user.command';
import { User } from '../../typeorm/models/user';
import { EmailConfirmation } from '../../typeorm/models/email.confirmation';

@CommandHandler(CreateConfirmedUserCommand)
export default class CreateConfirmedUserHandler
  implements ICommandHandler<CreateConfirmedUserCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
  ) { }

  public async execute(
    command: CreateConfirmedUserCommand,
  ): Promise<string | UserError> {
    const exists = await this.checkLoginEmailExists(command.data);
    if (exists !== UserError.NoError) return exists;

    const user = await User.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) return UserError.Unknown;

    const emailConfirmation = EmailConfirmation.create(user, true);
    await this.emailRepo.create(emailConfirmation);

    return created;
  }

  private async checkLoginEmailExists(
    data: UserInputModel,
  ): Promise<UserError> {
    const loginExists = await this.usersRepo.getByLoginOrEmail(data.login);
    if (loginExists) return UserError.LoginExists;
    const emailExists = await this.usersRepo.getByLoginOrEmail(data.email);
    if (emailExists) return UserError.EmailExists;

    return UserError.NoError;
  }
}
