import { UserBanDto } from '../../../models/dto/user.ban.dto';
import UserBanModel from '../../../models/user.ban.model';
import UserBanViewModel from '../../../models/view/user.ban.view.model';
import { UserBan } from '../user.ban';

export default class UserBanMapper {
  public static fromDomain(model: UserBanModel): UserBan {
    return new UserBan(model.toDto());
  }
  public static toDomain(model: UserBan): UserBanModel {
    return new UserBanModel(
      new UserBanDto(
        model.userId,
        model.isBanned,
        model.banReason,
        model.banDate,
      ),
    );
  }
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
