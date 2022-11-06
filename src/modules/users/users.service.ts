import { Injectable } from '@nestjs/common';
import UserInputModel from './models/user.input.model';
import UserModel from './models/user.model';
import UsersRepository from './users.repository';

@Injectable()
export default class UsersService {
  constructor(private readonly repo: UsersRepository) { }

  public async get(id: string): Promise<UserModel | undefined> {
    return this.repo.get(id);
  }
  public async create(data: UserInputModel): Promise<string | undefined> {
    const loginExists = await this.repo.getByLoginOrEmail(data.login);
    if (loginExists) return undefined;

    const emailExists = await this.repo.getByLoginOrEmail(data.email);
    if (emailExists) return undefined;

    const user = await UserModel.create(data);
    //const emailConfirmation = EmailConfirmationModel.createConfirmed(user.id);
    // Save emailConfirmation
    return this.repo.create(user);
  }
  public async delete(id: string): Promise<boolean> {
    // Delete all additional data
    return this.repo.delete(id);
  }
}
