export type BanInfo = {
  isBanned: boolean;
  banDate: string | undefined;
  banReason: string | undefined;
};

export default class BlogUserBanViewModel {
  constructor(
    public id: string,
    public login: string,
    public banInfo: BanInfo,
  ) { }
}
