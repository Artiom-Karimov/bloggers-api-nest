import { InjectRepository } from '@nestjs/typeorm';
import UserModel from '../models/user.model';
import { User } from './models/user';
import { Repository } from 'typeorm';
import UsersRepository from '../interfaces/users.repository';
import UserMapper from './models/mappers/user.mapper';

export class OrmUsersRepository extends UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super();
  }

  public async get(id: string): Promise<UserModel | undefined> {
    try {
      const user = await this.repo.findOne({ where: { id } });
      if (!user) return undefined;
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getByLoginOrEmail(
    value: string,
  ): Promise<UserModel | undefined> {
    try {
      const user = await this.repo.findOne({
        where: [{ login: value }, { email: value }],
      });
      if (!user) return undefined;
      return UserMapper.toDomain(user);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(user: UserModel): Promise<string | undefined> {
    try {
      const dbUser = UserMapper.fromDomain(user);
      const result = await this.repo.save(dbUser);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(user: UserModel): Promise<boolean> {
    return !!(await this.create(user));
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(id);
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
