export class BlogUserBan {
  constructor(
    public blogId: string,
    public userId: string,
    public isBanned: boolean,
    public banReason?: string,
    public banDate?: Date,
  ) { }
}
