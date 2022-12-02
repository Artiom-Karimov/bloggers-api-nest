import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../email.confirmation.repository';
import EmailConfirmationModel from '../../models/email/email.confirmation.model';
import UserModel from '../../models/user.model';
import UsersRepository from '../../users.repository';
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
  ): Promise<string | undefined> {
    const user = await UserModel.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) return undefined;

    const emailConfirmation = EmailConfirmationModel.createConfirmed(user.id);
    await this.emailRepo.create(emailConfirmation);

    return created;
  }
}
