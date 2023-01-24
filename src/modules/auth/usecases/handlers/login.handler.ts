import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import UsersRepository from '../../../users/interfaces/users.repository';
import TokenPair from '../../models/jwt/token.pair';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import SessionsService from '../../sessions.service';
import LoginCommand from '../commands/login.command';
import { User } from '../../../users/typeorm/models/user';
import { SessionCreateType } from '../../../users/models/input/session.create.type';
import { Session } from '../../../users/typeorm/models/session';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@CommandHandler(LoginCommand)
export default class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly service: SessionsService,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  public async execute(command: LoginCommand): Promise<TokenPair> {
    const { loginOrEmail, password, deviceName, ip } = command.data;
    const user = await this.checkLoginGetUser(loginOrEmail, password);

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
  ): Promise<User> {
    const ex = new UnauthorizedException('wrong credentials');

    const user = await this.usersRepo.getByLoginOrEmail(loginOrEmail);
    if (!user) throw ex;

    const loginAllowed = await this.service.checkLoginAllowed(user.id);
    if (!loginAllowed) throw ex;

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) throw ex;

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
