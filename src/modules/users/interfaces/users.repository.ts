import UserModel from '../models/user.model';

export default abstract class UsersRepository {
  public abstract get(id: string): Promise<UserModel | undefined>;

  public abstract getByLoginOrEmail(
    value: string,
  ): Promise<UserModel | undefined>;

  public abstract create(user: UserModel): Promise<string | undefined>;

  public abstract update(user: UserModel): Promise<boolean>;

  public abstract delete(id: string): Promise<boolean>;
}
