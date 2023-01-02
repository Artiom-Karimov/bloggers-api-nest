import SessionUserViewModel from '../../../models/view/session.user.view.model';
import { User } from '../user';
import UserViewModel from '../../../models/view/user.view.model';
import UserBanViewModel from '../../../models/view/user.ban.view.model';

export default class UserMapper {
  public static toView(model: User): UserViewModel {
    return new UserViewModel(
      model.id,
      model.login,
      model.email,
      model.createdAt.toISOString(),
      this.getBanView(model),
    );
  }
  public static toSessionView(model: User): SessionUserViewModel {
    return new SessionUserViewModel(model.email, model.login, model.id);
  }
  private static getBanView(model: User): UserBanViewModel {
    const ban = model.ban;
    if (ban?.isBanned)
      return new UserBanViewModel(
        ban.isBanned,
        ban.banDate.toISOString(),
        ban.banReason,
      );
    return new UserBanViewModel(false, null, null);
  }
}
