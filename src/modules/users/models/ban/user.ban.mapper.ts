import UserBanModel from './user.ban.model';
import UserBan from './user.ban.schema';
import UserBanViewModel from './user.ban.view.model';

export default class UserBanMapper {
  public static fromDomain(model: UserBanModel): UserBan {
    return new UserBan(
      model.userId,
      model.isBanned,
      model.banReason,
      model.banDate,
    );
  }
  public static toDomain(model: UserBan): UserBanModel {
    return new UserBanModel(
      model._id,
      model.isBanned,
      model.banReason,
      model.banDate,
    );
  }
  public static toView(model: UserBan): UserBanViewModel {
    return new UserBanViewModel(model.isBanned, model.banDate, model.banReason);
  }
  public static emptyView(): UserBanViewModel {
    return new UserBanViewModel(false, null, null);
  }
}
