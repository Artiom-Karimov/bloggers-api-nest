import SessionUserViewModel from '../../../models/view/session.user.view.model';
import UserModel from '../../../models/user.model';
import User from '../user';
import UserViewModel from '../../../models/view/user.view.model';
import UserWithBan from '../user.with.ban';
import UserBanViewModel from '../../../models/view/user.ban.view.model';
import UserDto from '../../../models/user.dto';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    const dto = model.toDto();
    return new User(
      dto.id,
      dto.login,
      dto.email,
      dto.passwordHash,
      new Date(dto.createdAt),
    );
  }
  public static toDomain(model: User): UserModel {
    return new UserModel(
      new UserDto(
        model.id,
        model.login,
        model.email,
        model.hash,
        model.createdAt.toISOString(),
      ),
    );
  }
  public static toView(model: UserWithBan): UserViewModel {
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
  private static getBanView(model: UserWithBan): UserBanViewModel {
    if (model.isBanned)
      return new UserBanViewModel(
        model.isBanned,
        model.banDate.toISOString(),
        model.banReason,
      );
    return new UserBanViewModel(false, null, null);
  }
}