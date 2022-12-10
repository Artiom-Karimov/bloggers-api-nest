import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import { BlogError } from '../../blogs/models/blog.error';
import { PostCreateModel } from '../commands/commands/create.post.command';
import { PostUpdateModel } from '../commands/commands/update.post.command';
import PostDto from './post.dto';

export default class PostModel {
  private _id: string;
  private _title: string;
  private _shortDescription: string;
  private _content: string;
  private _blogId: string;
  private _blogName: string;
  private _createdAt: string;
  private _blogBanned: boolean;

  constructor(dto: PostDto) {
    this._id = dto.id;
    this._title = dto.title;
    this._shortDescription = dto.shortDescription;
    this._content = dto.content;
    this._blogId = dto.blogId;
    this._blogName = dto.blogName;
    this._createdAt = dto.createdAt;
    this._blogBanned = dto.blogBanned;
  }

  public toDto(): PostDto {
    return new PostDto(
      this._id,
      this._title,
      this._shortDescription,
      this._content,
      this._blogId,
      this._blogName,
      this._createdAt,
      this._blogBanned,
    );
  }

  public static create(data: PostCreateModel): PostModel {
    return new PostModel(
      new PostDto(
        IdGenerator.generate(),
        data.title,
        data.shortDescription,
        data.content,
        data.blogId,
        data.blogName,
        DateGenerator.generate(),
        false,
      ),
    );
  }

  get id() {
    return this._id;
  }
  get blogId() {
    return this._blogId;
  }

  public updateData(data: PostUpdateModel): BlogError {
    if (data.postId !== this.id) return BlogError.Forbidden;
    if (data.blogId !== this.blogId) return BlogError.Forbidden;

    const { title, shortDescription, content } = data.data;
    this._title = title;
    this._shortDescription = shortDescription;
    this._content = content;

    return BlogError.NoError;
  }
}
