import { User } from '../typeorm/models/user';

export default abstract class UsersRepository {
  public abstract get(id: string): Promise<User | undefined>;

  public abstract getByLoginOrEmail(value: string): Promise<User | undefined>;

  public abstract create(user: User): Promise<string | undefined>;

  public abstract update(user: User): Promise<boolean>;

  public abstract delete(id: string): Promise<boolean>;
}
