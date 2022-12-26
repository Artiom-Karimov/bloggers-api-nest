import SessionUserViewModel from '../../../models/view/session.user.view.model';
import UserModel from '../../../models/user.model';
import { User } from '../user';
import UserViewModel from '../../../models/view/user.view.model';
import UserBanViewModel from '../../../models/view/user.ban.view.model';
import UserDto from '../../../models/dto/user.dto';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    return new User(model.toDto());
  }
  public static toDomain(model: User): UserModel {
    return new UserModel(
      new UserDto(
        model.id,
        model.login,
        model.email,
        model.hash,
        model.createdAt,
      ),
    );
  }
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
    if (model.ban?.isBanned)
      return new UserBanViewModel(
        model.ban.isBanned,
        model.ban.banDate.toISOString(),
        model.ban.banReason,
      );
    return new UserBanViewModel(false, null, null);
  }
}
