import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import { BlogError } from '../../blogs/models/blog.error';
import LikeCreateModel from './like.create.model';
import LikeDto from './like.dto';
import { LikeStatus } from './like.input.model';

export default class LikeModel {
  protected _id: string;
  protected _entityId: string;
  protected _userId: string;
  protected _userLogin: string;
  protected _userBanned: boolean;
  protected _status: LikeStatus;
  protected _lastModified: string;

  constructor(dto: LikeDto) {
    this._id = dto.id;
    this._entityId = dto.entityId;
    this._userId = dto.userId;
    this._userLogin = dto.userLogin;
    this._userBanned = dto.userBanned;
    this._status = dto.status;
    this._lastModified = dto.lastModified;
  }

  public static create(data: LikeCreateModel): LikeModel {
    return new LikeModel(
      new LikeDto(
        IdGenerator.generate(),
        data.entityId,
        data.userId,
        data.userLogin,
        false,
        data.likeStatus,
        DateGenerator.generate(),
      ),
    );
  }

  public toDto(): LikeDto {
    return new LikeDto(
      this._id,
      this._entityId,
      this._userId,
      this._userLogin,
      this._userBanned,
      this._status,
      this._lastModified,
    );
  }

  public updateData(status: LikeStatus, userId: string): BlogError {
    if (this._userId !== userId) return BlogError.Forbidden;
    this._status = status;
    this._lastModified = DateGenerator.generate();
    return BlogError.NoError;
  }
}
