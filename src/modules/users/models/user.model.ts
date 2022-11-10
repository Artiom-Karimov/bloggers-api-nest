import DateGenerator from '../../../common/utils/date.generator';
import Hasher from '../../../common/utils/hasher';
import IdGenerator from '../../../common/utils/id.generator';
import UserInputModel from './user.input.model';

export default class UserModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public passwordHash: string,
    public salt: string,
    public createdAt: string,
  ) { }

  public static async create(data: UserInputModel): Promise<UserModel> {
    const hashPair = await Hasher.hash(data.password);
    return new UserModel(
      IdGenerator.generate(),
      data.login,
      data.email,
      hashPair.hash,
      hashPair.salt,
      DateGenerator.generate(),
    );
  }
  public static async updatePassword(
    user: UserModel,
    newPassword: string,
  ): Promise<UserModel> {
    const hashPair = await Hasher.hash(newPassword);
    user.passwordHash = hashPair.hash;
    user.salt = hashPair.salt;
    return user;
  }
}
