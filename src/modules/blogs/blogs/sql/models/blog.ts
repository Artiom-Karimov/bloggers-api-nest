export class Blog {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public userId?: string,
    public userLogin?: string,
    public isBanned?: boolean,
    public banDate?: Date,
  ) { }
}
