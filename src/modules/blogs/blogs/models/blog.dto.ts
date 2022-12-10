import { BlogBanInfo, BlogOwnerInfo } from './blog.model';

export default class BlogDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public ownerInfo?: BlogOwnerInfo,
    public banInfo?: BlogBanInfo,
  ) { }
}
