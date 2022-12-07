import SessionUserViewModel from '../../../models/view/session.user.view.model';
import UserBanViewModel from '../../../models/view/user.ban.view.model';
import UserModel from '../../../models/user.model';
import User from '../user';
import UserViewModel from '../../../models/view/user.view.model';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    return new User(
      model.id,
      model.login,
      model.email,
      model.passwordHash,
      new Date(model.createdAt),
    );
  }
  public static toDomain(model: User): UserModel {
    return new UserModel(
      model.id,
      model.login,
      model.email,
      model.hash,
      model.createdAt.toISOString(),
    );
  }
  public static toView(model: User, banInfo: UserBanViewModel): UserViewModel {
    return new UserViewModel(
      model.id,
      model.login,
      model.email,
      model.createdAt.toISOString(),
      banInfo,
    );
  }
  public static toSessionView(model: User): SessionUserViewModel {
    return new SessionUserViewModel(model.email, model.login, model.id);
  }
}
