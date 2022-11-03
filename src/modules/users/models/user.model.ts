import DateGenerator from 'src/common/utils/date.generator';
import Hasher from 'src/common/utils/hasher';
import IdGenerator from 'src/common/utils/id.generator';

export type UserInputModel = {
  login: string;
  email: string;
  password: string;
};

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
}
