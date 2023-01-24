import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import EmailConfirmationRepository from '../../interfaces/email.confirmation.repository';
import UserInputModel from '../../models/input/user.input.model';
import UsersRepository from '../../interfaces/users.repository';
import CreateConfirmedUserCommand from '../commands/create.confirmed.user.command';
import { User } from '../../typeorm/models/user';
import { EmailConfirmation } from '../../typeorm/models/email.confirmation';
import { throwValidationException } from '../../../../common/utils/validation.options';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateConfirmedUserCommand)
export default class CreateConfirmedUserHandler
  implements ICommandHandler<CreateConfirmedUserCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
  ) { }

  public async execute(command: CreateConfirmedUserCommand): Promise<string> {
    await this.checkLoginEmailExists(command.data);

    const user = await User.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) throw new BadRequestException('cannot create user');

    const emailConfirmation = EmailConfirmation.create(user, true);
    await this.emailRepo.create(emailConfirmation);

    return created;
  }

  private async checkLoginEmailExists(data: UserInputModel): Promise<void> {
    const loginExists = await this.usersRepo.getByLoginOrEmail(data.login);
    if (loginExists) throwValidationException('login', 'login already taken');
    const emailExists = await this.usersRepo.getByLoginOrEmail(data.email);
    if (emailExists) throwValidationException('email', 'email already taken');
  }
}
