import { Injectable } from '@nestjs/common';
import SessionsRepository from '../auth/sessions.repository';
import CommentsService from '../posts/comments/comments.service';
import PostsService from '../posts/posts/posts.service';
import EmailConfirmationRepository from './email.confirmation.repository';
import UserBanInputModel from './models/ban/user.ban.input.model';
import UserBanModel from './models/ban/user.ban.model';
import EmailConfirmationModel from './models/email/email.confirmation.model';
import UserInputModel from './models/user.input.model';
import UserModel from './models/user.model';
import UsersBanRepository from './users.ban.repository';
import UsersRepository from './users.repository';

@Injectable()
export default class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly banRepo: UsersBanRepository,
    private readonly emailRepo: EmailConfirmationRepository,
    private readonly sessionsRepo: SessionsRepository,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) { }

  public async get(id: string): Promise<UserModel | undefined> {
    return this.repo.get(id);
  }
  public getByLoginOrEmail(input: string): Promise<UserModel | undefined> {
    return this.repo.getByLoginOrEmail(input);
  }
  public async create(data: UserInputModel): Promise<string | undefined> {
    const user = await UserModel.create(data);
    return this.repo.create(user);
  }
  public async createConfirmed(
    data: UserInputModel,
  ): Promise<string | undefined> {
    const user = await UserModel.create(data);
    const created = await this.repo.create(user);
    if (!created) return undefined;

    const emailConfirmation = EmailConfirmationModel.createConfirmed(user.id);
    await this.emailRepo.create(emailConfirmation);

    return created;
  }
  public async delete(id: string): Promise<boolean> {
    const user = await this.repo.get(id);
    if (!user) return false;

    const result = await this.repo.delete(id);
    if (!result) return false;

    await this.emailRepo.delete(id);
    await this.banRepo.delete(id);

    return true;
  }
  public async updatePassword(id: string, password: string): Promise<boolean> {
    let user = await this.get(id);
    if (!user) return false;

    user = await UserModel.updatePassword(user, password);
    return this.repo.update(user.id, user);
  }
  public async loginOrEmailExists(input: string): Promise<boolean> {
    const result = await this.repo.getByLoginOrEmail(input);
    return !!result;
  }
  public async putBanInfo(data: UserBanInputModel): Promise<boolean> {
    if (!data.isBanned) {
      await this.banRepo.delete(data.userId);
      await this.postsService.setUserBanned(data.userId, false);
      await this.commentsService.setUserBanned(data.userId, false);
      return true;
    }
    const user = await this.get(data.userId);
    if (!user) return false;

    await this.sessionsRepo.deleteAll(user.id);

    const model = UserBanModel.create(data);
    await this.postsService.setUserBanned(data.userId, true);
    await this.commentsService.setUserBanned(data.userId, true);

    return this.banRepo.createOrUpdate(model);
  }
}
