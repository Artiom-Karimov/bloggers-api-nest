export class BlogBan {
  constructor(
    public blogId: string,
    public isBanned: boolean,
    public banDate: Date,
  ) { }
}
