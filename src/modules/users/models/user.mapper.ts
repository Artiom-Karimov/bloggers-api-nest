import UserBanViewModel from './ban/user.ban.view.model';
import UserModel from './user.model';
import User from './user.schema';
import UserViewModel from './user.view.model';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    const user = new User(
      model.id,
      model.login,
      model.email,
      model.passwordHash,
      model.salt,
      model.createdAt,
    );
    return user;
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
}
