import Hasher from '../../../common/utils/hasher';
import IdGenerator from '../../../common/utils/id.generator';
import UserInputModel from './input/user.input.model';
import UserDto from './dto/user.dto';

export default class UserModel {
  private _id: string;
  private _login: string;
  private _email: string;
  private _passwordHash: string;
  private _createdAt: Date;

  constructor(dto: UserDto) {
    this._id = dto.id;
    this._login = dto.login;
    this._email = dto.email;
    this._passwordHash = dto.passwordHash;
    this._createdAt = dto.createdAt;
  }

  public static async create(data: UserInputModel): Promise<UserModel> {
    const hash = await Hasher.hash(data.password);
    return new UserModel(
      new UserDto(
        IdGenerator.generate(),
        data.login,
        data.email,
        hash,
        new Date(),
      ),
    );
  }

  public toDto(): UserDto {
    return new UserDto(
      this._id,
      this._login,
      this._email,
      this._passwordHash,
      this._createdAt,
    );
  }

  get id(): string {
    return this._id;
  }
  get login(): string {
    return this._login;
  }
  get email(): string {
    return this._email;
  }

  public async checkPassword(password: string): Promise<boolean> {
    return Hasher.check(password, this._passwordHash);
  }
  public async updatePassword(newPassword: string): Promise<UserModel> {
    this._passwordHash = await Hasher.hash(newPassword);
    return this;
  }
}
