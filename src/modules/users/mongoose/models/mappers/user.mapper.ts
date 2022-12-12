import SessionUserViewModel from '../../../models/view/session.user.view.model';
import UserBanViewModel from '../../../models/view/user.ban.view.model';
import UserModel from '../../../models/user.model';
import User from '../user.schema';
import UserViewModel from '../../../models/view/user.view.model';
import UserDto from '../../../models/user.dto';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    const dto = model.toDto();
    return new User(
      dto.id,
      dto.login,
      dto.email,
      dto.passwordHash,
      dto.createdAt,
    );
  }
  public static toDomain(model: User): UserModel {
    return new UserModel(
      new UserDto(
        model._id,
        model.login,
        model.email,
        model.passwordHash,
        model.createdAt,
      ),
    );
  }
  public static toView(model: User, banInfo: UserBanViewModel): UserViewModel {
    return new UserViewModel(
      model._id,
      model.login,
      model.email,
      model.createdAt,
      banInfo,
    );
  }
  public static toSessionView(model: User): SessionUserViewModel {
    return new SessionUserViewModel(model.email, model.login, model._id);
  }
}
