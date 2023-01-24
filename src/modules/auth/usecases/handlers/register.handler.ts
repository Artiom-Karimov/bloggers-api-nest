import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../mail/mail.service';
import EmailConfirmationRepository from '../../../users/interfaces/email.confirmation.repository';
import { UserError } from '../../../users/models/user.error';
import UserInputModel from '../../../users/models/input/user.input.model';
import UsersRepository from '../../../users/interfaces/users.repository';
import RegisterCommand from '../commands/register.command';
import { User } from '../../../users/typeorm/models/user';
import { EmailConfirmation } from '../../../users/typeorm/models/email.confirmation';
import { throwValidationException } from '../../../../common/utils/validation.options';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(RegisterCommand)
export default class RegisterHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly mailService: MailService,
  ) { }

  public async execute(command: RegisterCommand): Promise<void> {
    await this.checkLoginEmailExists(command.data);

    const user = await User.create(command.data);
    const created = await this.usersRepo.create(user);
    if (!created) throw new BadRequestException('cannot create user');

    const retrieved = await this.usersRepo.get(created);
    if (!retrieved) throw new BadRequestException('cannot create user');

    const success = await this.createEmailConfirmation(retrieved);

    if (!success) throw new BadRequestException('cannot create user');
  }

  private async checkLoginEmailExists(data: UserInputModel): Promise<void> {
    const loginExists = await this.usersRepo.getByLoginOrEmail(data.login);
    if (loginExists) throwValidationException('login', 'login already exists');
    const emailExists = await this.usersRepo.getByLoginOrEmail(data.email);
    if (emailExists) throwValidationException('email', 'email already exists');
  }

  private async createEmailConfirmation(user: User): Promise<boolean> {
    const ec = EmailConfirmation.create(user);

    const created = await this.emailRepo.create(ec);

    await this.mailService.sendEmailConfirmation(user, ec.confirmationCode);
    return created;
  }
}
