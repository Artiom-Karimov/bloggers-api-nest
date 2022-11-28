import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import BlogInputModel from './blog.input.model';

export type BlogOwnerInfo = {
  userId?: string;
  userLogin?: string;
};
export type BlogBanInfo = {
  isBanned: boolean;
  banDate?: string;
};

export default class BlogModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public ownerInfo?: BlogOwnerInfo,
    public banInfo?: BlogBanInfo,
  ) { }
  public static create(
    data: BlogInputModel,
    ownerInfo?: BlogOwnerInfo,
    banInfo?: BlogBanInfo,
  ): BlogModel {
    return new BlogModel(
      IdGenerator.generate(),
      data.name,
      data.description,
      data.websiteUrl,
      DateGenerator.generate(),
      ownerInfo,
      banInfo,
    );
  }
  public static createBanInfo(isBanned: boolean): BlogBanInfo {
    if (isBanned)
      return {
        isBanned: true,
        banDate: new Date().toISOString(),
      };
    return {
      isBanned: false,
      banDate: null,
    };
  }
}
