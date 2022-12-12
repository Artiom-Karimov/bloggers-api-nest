import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import { BlogUserBanCreateModel } from '../commands/commands/blog.user.ban.command';
import BlogUserBanDto from './blog.user.ban.dto';

export default class BlogUserBanModel {
  private _id: string;
  private _blogId: string;
  private _userId: string;
  private _userLogin: string;
  private _isBanned: boolean;
  private _banReason: string;
  private _banDate: string;

  constructor(dto: BlogUserBanDto) {
    this._id = dto.id;
    this._blogId = dto.blogId;
    this._userId = dto.userId;
    this._userLogin = dto.userLogin;
    this._isBanned = dto.isBanned;
    this._banReason = dto.banReason;
    this._banDate = dto.banDate;
  }

  public toDto(): BlogUserBanDto {
    return new BlogUserBanDto(
      this._id,
      this._blogId,
      this._userId,
      this._userLogin,
      this._isBanned,
      this._banReason,
      this._banDate,
    );
  }
  public static create(data: BlogUserBanCreateModel): BlogUserBanModel {
    return new BlogUserBanModel(
      new BlogUserBanDto(
        IdGenerator.generate(),
        data.blogId,
        data.userId,
        data.userLogin,
        data.isBanned,
        data.banReason,
        DateGenerator.generate(),
      ),
    );
  }
}
