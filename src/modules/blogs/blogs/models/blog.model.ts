import IdGenerator from '../../../../common/utils/id.generator';
import { regex } from '../../../../common/utils/validation.regex';
import BlogDto from './blog.dto';
import BlogInputModel from './input/blog.input.model';

export default class BlogModel {
  private _id: string;
  private _name: string;
  private _description: string;
  private _websiteUrl: string;
  private _createdAt: Date;
  private _ownerId: string | null;
  private _isBanned: boolean;
  private _banDate: Date | null;

  constructor(dto: BlogDto) {
    this._id = dto.id;
    this._name = dto.name;
    this._description = dto.description;
    this._websiteUrl = dto.websiteUrl;
    this._createdAt = dto.createdAt;
    this._ownerId = dto.ownerId;
    this._isBanned = dto.isBanned;
    this._banDate = dto.banDate;
  }
  public static create(data: BlogInputModel, ownerId?: string): BlogModel {
    return new BlogModel({
      id: IdGenerator.generate(),
      name: data.name,
      description: data.description,
      websiteUrl: data.websiteUrl,
      createdAt: new Date(),
      ownerId,
      isBanned: false,
      banDate: null,
    });
  }
  public toDto() {
    return new BlogDto(
      this._id,
      this._name,
      this._description,
      this._websiteUrl,
      this._createdAt,
      this._ownerId,
      this._isBanned,
      this._banDate,
    );
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }

  get isBanned(): boolean {
    return this._isBanned;
  }
  set isBanned(isBanned: boolean) {
    if (this._isBanned === isBanned) return;
    this._isBanned = isBanned;
    this._banDate = isBanned ? new Date() : null;
  }

  get ownerId(): string | null {
    if (!this._ownerId) return null;
    return this._ownerId;
  }
  set ownerId(id: string) {
    if (this._ownerId) throw new Error('Blog already has an owner');
    if (!id || !regex.uuid.test(id)) throw new Error('Invalid blog owner');
    this._ownerId = id;
  }

  updateData(data: BlogInputModel) {
    this._name = data.name;
    this._websiteUrl = data.websiteUrl;
    this._description = data.description;
  }
}
