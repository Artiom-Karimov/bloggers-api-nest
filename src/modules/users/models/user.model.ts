import DateGenerator from '../../../common/utils/date.generator';
import Hasher from '../../../common/utils/hasher';
import IdGenerator from '../../../common/utils/id.generator';
import UserInputModel from './input/user.input.model';

export default class UserModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: string,
  ) { }

  public static async create(data: UserInputModel): Promise<UserModel> {
    const hash = await Hasher.hash(data.password);
    return new UserModel(
      IdGenerator.generate(),
      data.login,
      data.email,
      hash,
      DateGenerator.generate(),
    );
  }
  public async checkPassword(password: string): Promise<boolean> {
    return Hasher.check(password, this.passwordHash);
  }
  public async updatePassword(newPassword: string): Promise<UserModel> {
    this.passwordHash = await Hasher.hash(newPassword);
    return this;
  }
}
