export default class BlogDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public ownerId: string | null,
    public isBanned: boolean,
    public banDate: Date | null,
  ) { }
}
