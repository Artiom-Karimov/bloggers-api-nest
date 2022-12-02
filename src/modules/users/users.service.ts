import { Injectable } from '@nestjs/common';
import EmailConfirmationRepository from './email.confirmation.repository';
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
    let user = await this.repo.get(id);
    if (!user) return false;

    user = await UserModel.updatePassword(user, password);
    return this.repo.update(user.id, user);
  }
  public async loginOrEmailExists(input: string): Promise<boolean> {
    const result = await this.repo.getByLoginOrEmail(input);
    return !!result;
  }
}
