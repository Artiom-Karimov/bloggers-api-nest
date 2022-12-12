export default class BlogUserBanDto {
  constructor(
    public id: string,
    public blogId: string,
    public userId: string,
    public userLogin: string,
    public isBanned: boolean,
    public banReason: string,
    public banDate: string,
  ) { }
}
