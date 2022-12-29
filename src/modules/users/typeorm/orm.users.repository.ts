import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user';
import { Repository } from 'typeorm';
import UsersRepository from '../interfaces/users.repository';

export class OrmUsersRepository extends UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super();
  }

  public async get(id: string): Promise<User | undefined> {
    try {
      const user = await this.repo.findOne({ where: { id } });
      return user ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getByLoginOrEmail(value: string): Promise<User | undefined> {
    try {
      const user = await this.repo.findOne({
        where: [{ login: value }, { email: value }],
      });
      return user ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(user: User): Promise<string | undefined> {
    try {
      const result = await this.repo.save(user);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(user: User): Promise<boolean> {
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
