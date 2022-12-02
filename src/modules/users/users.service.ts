import { Injectable } from '@nestjs/common';
import UserModel from './models/user.model';
import UsersRepository from './users.repository';

@Injectable()
export default class UsersService {
  constructor(private readonly repo: UsersRepository) { }

  public async updatePassword(id: string, password: string): Promise<boolean> {
    let user = await this.repo.get(id);
    if (!user) return false;

    user = await UserModel.updatePassword(user, password);
    return this.repo.update(user.id, user);
  }
}
