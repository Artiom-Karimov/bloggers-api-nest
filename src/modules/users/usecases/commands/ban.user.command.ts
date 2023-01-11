export type BanUserCreateModel = {
  isBanned: boolean;
  banReason: string;
  userId: string;
};

export default class BanUserCommand {
  constructor(public data: BanUserCreateModel) { }
}
