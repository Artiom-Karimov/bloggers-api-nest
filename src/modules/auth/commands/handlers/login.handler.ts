import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserError } from '../../../users/user.error';
import UserModel from '../../../users/models/user.model';
import UsersRepository from '../../../users/users.repository';
import TokenPair from '../../models/jwt/token.pair';
import SessionModel, {
  SessionCreateType,
} from '../../models/session/session.model';
import SessionsRepository from '../../sessions.repository';
import SessionsService from '../../sessions.service';
import LoginCommand from '../commands/login.command';

@CommandHandler(LoginCommand)
export default class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly service: SessionsService,
    private readonly sessionsRepo: SessionsRepository,
  ) { }

  public async execute(command: LoginCommand): Promise<TokenPair | UserError> {
    const { loginOrEmail, password, deviceName, ip } = command.data;
    const userResult = await this.checkLoginGetUser(loginOrEmail, password);
    if (!(userResult instanceof UserModel)) return userResult;

    const session = await this.createSession({
      ip,
      deviceName,
      userId: userResult.id,
    });
    return this.service.createTokenPair(session, userResult.login);
  }
  private async checkLoginGetUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserModel | UserError> {
    const user = await this.usersRepo.getByLoginOrEmail(loginOrEmail);
    if (!user) return UserError.WrongCredentials;

    const loginAllowed = await this.service.checkLoginAllowed(user.id);
    if (loginAllowed !== UserError.NoError) return loginAllowed;

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) return UserError.WrongCredentials;

    return user;
  }
  private async createSession(data: SessionCreateType): Promise<SessionModel> {
    const session = SessionModel.create(data);
    await this.sessionsRepo.create(session);
    return session;
  }
}
