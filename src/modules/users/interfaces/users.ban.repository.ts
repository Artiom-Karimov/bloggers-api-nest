import { UserBan } from '../typeorm/models/user.ban';

export default abstract class UsersBanRepository {
  public abstract get(userId: string): Promise<UserBan | undefined>;
  public abstract createOrUpdate(model: UserBan): Promise<boolean>;
  public abstract delete(userId: string): Promise<boolean>;
}
