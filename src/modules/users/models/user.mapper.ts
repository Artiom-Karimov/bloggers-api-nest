import UserModel from './user.model';
import User from './user.schema';
import UserViewModel from './user.view.model';

export default class UserMapper {
  public static fromDomain(model: UserModel): User {
    const user = new User();
    user._id = model.id;
    user.login = model.login;
    user.email = model.email;
    user.passwordHash = model.passwordHash;
    user.salt = model.salt;
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
  public static toView(model: User): UserViewModel {
    return new UserViewModel(
      model._id,
      model.login,
      model.email,
      model.createdAt,
    );
  }
}
