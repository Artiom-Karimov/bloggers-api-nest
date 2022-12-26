export class UserBanDto {
  constructor(
    public userId: string,
    public isBanned: boolean,
    public banReason: string,
    public banDate: Date,
  ) { }
}
