export class BlogUserBanCreateModel {
  constructor(
    public isBanned: boolean,
    public banReason: string,
    public blogId: string,
    public userId: string,
    public bloggerId: string,
    public userLogin?: string,
  ) { }
}

export default class BlogUserBanCommand {
  constructor(public data: BlogUserBanCreateModel) { }
}
