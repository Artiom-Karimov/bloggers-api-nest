import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import EmailConfirmationModel from '../../../users/models/email.confirmation.model';
import { UserError } from '../../../users/user.error';
import UserInputModel from '../../../users/models/input/user.input.model';
import UserModel from '../../../users/models/user.model';
import UsersRepository from '../../../users/interfaces/users.repository';
import RegisterCommand from '../commands/register.command';

@CommandHandler(RegisterCommand)
export default class RegisterHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly mailService: MailService,
  ) { }

  public async execute(command: RegisterCommand): Promise<UserError> {
    const exists = await this.checkLoginEmailExists(command.data);
    if (exists !== UserError.NoError) return exists;

    const user = await UserModel.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) return UserError.Unknown;

    const retrieved = await this.usersRepo.get(created);
    if (!retrieved) return UserError.Unknown;

    const success = await this.createEmailConfirmation(retrieved);

    return success ? UserError.NoError : UserError.Unknown;
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

  private async createEmailConfirmation(user: UserModel): Promise<boolean> {
    const ec = EmailConfirmationModel.create(user.id);

    const created = await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.code);
    return created;
  }
}
