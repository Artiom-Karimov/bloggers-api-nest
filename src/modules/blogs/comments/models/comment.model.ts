import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import { BlogError } from '../../blogs/models/blog.error';
import { CommentCreateModel } from '../commands/commands/create.comment.command';
import CommentDto from './comment.dto';

export default class CommentModel {
  private _id: string;
  private _postId: string;
  private _userId: string;
  private _userLogin: string;
  private _bannedByAdmin: boolean;
  private _bannedByBlogger: boolean;
  private _content: string;
  private _createdAt: string;

  constructor(dto: CommentDto) {
    this._id = dto.id;
    this._postId = dto.postId;
    this._userId = dto.userId;
    this._userLogin = dto.userLogin;
    this._bannedByAdmin = dto.bannedByAdmin;
    this._bannedByBlogger = dto.bannedByBlogger;
    this._content = dto.content;
    this._createdAt = dto.createdAt;
  }

  public toDto(): CommentDto {
    return new CommentDto(
      this._id,
      this._postId,
      this._userId,
      this._userLogin,
      this._bannedByAdmin,
      this._bannedByBlogger,
      this._content,
      this._createdAt,
    );
  }

  public static create(data: CommentCreateModel): CommentModel {
    return new CommentModel(
      new CommentDto(
        IdGenerator.generate(),
        data.postId,
        data.userId,
        data.userLogin,
        false,
        false,
        data.content,
        DateGenerator.generate(),
      ),
    );
  }

  get userId(): string {
    return this._userId;
  }

  public setContent(content: string, userId: string): BlogError {
    if (userId !== this._userId) return BlogError.Forbidden;
    this._content = content;
    return BlogError.NoError;
  }
}
