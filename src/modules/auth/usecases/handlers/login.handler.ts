import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/models/user.error';
import UsersRepository from '../../../users/interfaces/users.repository';
import TokenPair from '../../models/jwt/token.pair';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import SessionsService from '../../sessions.service';
import LoginCommand from '../commands/login.command';
import { User } from '../../../users/typeorm/models/user';
import { SessionCreateType } from '../../../users/models/input/session.create.type';
import { Session } from '../../../users/typeorm/models/session';

@CommandHandler(LoginCommand)
export default class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly service: SessionsService,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  public async execute(command: LoginCommand): Promise<TokenPair | UserError> {
    const { loginOrEmail, password, deviceName, ip } = command.data;
    const user = await this.checkLoginGetUser(loginOrEmail, password);
    if (!(user instanceof User)) return user;

    const session = await this.createSession(
      {
        ip,
        deviceName,
        userId: user.id,
        userLogin: user.login,
      },
      user,
    );

    return session.getTokens();
  }
  private async checkLoginGetUser(
    loginOrEmail: string,
    password: string,
  ): Promise<User | UserError> {
    const user = await this.usersRepo.getByLoginOrEmail(loginOrEmail);
    if (!user) return UserError.WrongCredentials;

    const loginAllowed = await this.service.checkLoginAllowed(user.id);
    if (loginAllowed !== UserError.NoError) return loginAllowed;

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) return UserError.WrongCredentials;

    return user;
  }
  private async createSession(
    data: SessionCreateType,
    user: User,
  ): Promise<Session> {
    const session = Session.create(data, user);
    await this.sessionsRepo.create(session);
    return session;
  }
}
