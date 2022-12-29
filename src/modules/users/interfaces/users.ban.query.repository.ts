import UserBanViewModel from '../models/view/user.ban.view.model';

export default abstract class UsersBanQueryRepository {
  public abstract get(userId: string): Promise<UserBanViewModel | undefined>;
}
