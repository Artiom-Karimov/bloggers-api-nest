import { Injectable } from '@nestjs/common';
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
  ) { }

  public async get(id: string): Promise<UserModel | undefined> {
    return this.repo.get(id);
  }
  public async create(data: UserInputModel): Promise<string | undefined> {
    const loginExists = await this.repo.getByLoginOrEmail(data.login);
    if (loginExists) return undefined;

    const emailExists = await this.repo.getByLoginOrEmail(data.email);
    if (emailExists) return undefined;

    const user = await UserModel.create(data);
    const created = await this.repo.create(user);
    if (!created) return undefined;

    const emailConfirmation = EmailConfirmationModel.createConfirmed(user.id);
    //await this.repo.createEmailConfirmation(emailConfirmation);

    return created;
  }
  public async delete(id: string): Promise<boolean> {
    const user = await this.repo.get(id);
    if (!user) return false;

    const result = await this.repo.delete(id);
    if (!result) return false;

    //await this.repo.deleteEmailConfirmation(id);
    await this.banRepo.delete(id);

    return true;
  }
  public async putBanInfo(data: UserBanInputModel): Promise<boolean> {
    if (!data.isBanned) {
      await this.banRepo.delete(data.userId);
      return true;
    }

    const model = UserBanModel.create(data);
    return this.banRepo.createOrUpdate(model);
  }
}
