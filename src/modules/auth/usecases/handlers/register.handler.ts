import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import { UserError } from '../../../users/models/user.error';
import UserInputModel from '../../../users/models/input/user.input.model';
import UsersRepository from '../../../users/interfaces/users.repository';
import RegisterCommand from '../commands/register.command';
import { User } from '../../../users/typeorm/models/user';
import { EmailConfirmation } from '../../../users/typeorm/models/email.confirmation';

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

    const user = await User.create(command.data);
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

  private async createEmailConfirmation(user: User): Promise<boolean> {
    const ec = EmailConfirmation.create(user);

    const created = await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.confirmationCode);
    return created;
  }
}
