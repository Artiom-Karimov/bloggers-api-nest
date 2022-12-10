import { Exception } from 'handlebars';
import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import BlogDto from './blog.dto';
import BlogInputModel from './input/blog.input.model';

export type BlogOwnerInfo = {
  userId?: string;
  userLogin?: string;
};
export type BlogBanInfo = {
  isBanned: boolean;
  banDate?: string;
};

export default class BlogModel {
  private _id: string;
  private _name: string;
  private _description: string;
  private _websiteUrl: string;
  private _createdAt: string;
  private _ownerInfo?: BlogOwnerInfo;
  private _banInfo?: BlogBanInfo;

  constructor(dto: BlogDto) {
    this._id = dto.id;
    this._name = dto.name;
    this._description = dto.description;
    this._websiteUrl = dto.websiteUrl;
    this._createdAt = dto.createdAt;
    this._ownerInfo = dto.ownerInfo;
    this._banInfo = dto.banInfo;
  }
  public static create(
    data: BlogInputModel,
    ownerInfo?: BlogOwnerInfo,
    banInfo?: BlogBanInfo,
  ): BlogModel {
    return new BlogModel({
      id: IdGenerator.generate(),
      name: data.name,
      description: data.description,
      websiteUrl: data.websiteUrl,
      createdAt: DateGenerator.generate(),
      ownerInfo: ownerInfo,
      banInfo: banInfo,
    });
  }
  public toDto() {
    return new BlogDto(
      this._id,
      this._name,
      this._description,
      this._websiteUrl,
      this._createdAt,
      { ...this._ownerInfo },
      { ...this._banInfo },
    );
  }

  get id(): string {
    return this._id;
  }
  get isBanned(): boolean {
    return this._banInfo.isBanned;
  }
  get ownerId(): string | null {
    if (!this._ownerInfo || !this._ownerInfo.userId) return null;
    return this._ownerInfo.userId;
  }

  set banInfo(isBanned: boolean) {
    if (this._banInfo?.isBanned === isBanned) return;
    this._banInfo = {
      isBanned,
      banDate: isBanned ? DateGenerator.generate() : null,
    };
  }
  set ownerInfo(data: BlogOwnerInfo) {
    if (this.ownerId) throw new Exception('Blog already has an owner');
    if (!(data.userId || data.userLogin))
      throw new Exception('Invalid blog owner');
    this.ownerInfo = { userId: data.userId, userLogin: data.userLogin };
  }

  updateData(data: BlogInputModel) {
    this._name = data.name;
    this._websiteUrl = data.websiteUrl;
    this._description = data.description;
  }
}
