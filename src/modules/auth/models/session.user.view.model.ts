import UserModel from '../../users/models/user.model';

export default class SessionUserViewModel {
  constructor(
    public email: string,
    public login: string,
    public userId: string,
  ) { }
  public static fromDomain(model: UserModel): SessionUserViewModel {
    return new SessionUserViewModel(model.email, model.login, model.id);
  }
}
