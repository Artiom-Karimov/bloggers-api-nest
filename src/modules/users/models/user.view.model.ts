import UserBanViewModel from './ban/user.ban.view.model';

export default class UserViewModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
    public banInfo: UserBanViewModel,
  ) { }
}
