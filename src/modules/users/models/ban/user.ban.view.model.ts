export default class UserBanViewModel {
  constructor(
    public isBanned: boolean,
    public banDate: string,
    public banReason: string,
  ) { }
}
