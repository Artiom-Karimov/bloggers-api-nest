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
  public getByLoginOrEmail(input: string): Promise<UserModel | undefined> {
    return this.repo.getByLoginOrEmail(input);
  }
  public async create(data: UserInputModel): Promise<string | undefined> {
    const user = await UserModel.create(data);
    return this.repo.create(user);
  }
  public async updatePassword(id: string, password: string): Promise<boolean> {
    let user = await this.repo.get(id);
    if (!user) return false;

    user = await UserModel.updatePassword(user, password);
    return this.repo.update(user.id, user);
  }
}
