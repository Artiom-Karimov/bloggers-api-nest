import SessionUserViewModel from '../../auth/models/session.user.view.model';
import UserBanViewModel from './ban/user.ban.view.model';
import UserModel from './user.model';
import User from './user.schema';
import UserViewModel from './user.view.model';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    return new User(
      model.id,
      model.login,
      model.email,
      model.passwordHash,
      model.salt,
      model.createdAt,
    );
  }
  public static toDomain(model: User): UserModel {
    return new UserModel(
      model._id,
      model.login,
      model.email,
      model.passwordHash,
      model.salt,
      model.createdAt,
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
