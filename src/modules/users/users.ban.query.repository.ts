import UserBanViewModel from './models/view/user.ban.view.model';

export default abstract class UsersBanQueryRepository {
  public abstract get(id: string): Promise<UserBanViewModel | undefined>;
}
