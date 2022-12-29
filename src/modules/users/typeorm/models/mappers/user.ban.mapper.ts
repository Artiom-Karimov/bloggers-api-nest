import UserBanViewModel from '../../../models/view/user.ban.view.model';
import { UserBan } from '../user.ban';

export default class UserBanMapper {
  public static toView(model: UserBan): UserBanViewModel {
    return new UserBanViewModel(
      model.isBanned,
      model.banDate.toISOString(),
      model.banReason,
    );
  }
  public static emptyView(): UserBanViewModel {
    return new UserBanViewModel(false, null, null);
  }
}
