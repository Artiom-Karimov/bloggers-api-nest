export default class UserBanViewModel {
  constructor(
    public isBanned: boolean,
    public banDate: string | null,
    public banReason: string | null,
  ) { }
}
