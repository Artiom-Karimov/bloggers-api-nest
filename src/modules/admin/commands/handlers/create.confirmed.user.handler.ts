import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../../users/email.confirmation.repository';
import EmailConfirmationModel from '../../../users/models/email/email.confirmation.model';
import { UserError } from '../../../users/models/user.error';
import UserModel from '../../../users/models/user.model';
import UsersRepository from '../../../users/users.repository';
import CreateConfirmedUserCommand from '../commands/create.confirmed.user.command';

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
    const user = await UserModel.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) return UserError.Unknown;

    const emailConfirmation = EmailConfirmationModel.createConfirmed(user.id);
    await this.emailRepo.create(emailConfirmation);

    return created;
  }
}
