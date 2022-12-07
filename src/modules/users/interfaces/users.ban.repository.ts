import UserBanModel from '../models/user.ban.model';

export default abstract class UsersBanRepository {
  public abstract get(id: string): Promise<UserBanModel | undefined>;
  public abstract createOrUpdate(model: UserBanModel): Promise<boolean>;
  public abstract delete(userId: string): Promise<boolean>;
}
