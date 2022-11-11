import DateGenerator from '../../../../common/utils/date.generator';
import UserBanInputModel from './user.ban.input.model';

export default class UserBanModel {
  constructor(
    public userId: string,
    public isBanned: boolean,
    public banReason: string,
    public banDate: string,
  ) { }
  public static create(data: UserBanInputModel): UserBanModel {
    if (!data.userId) throw new Error('You must specify userId for ban');
    return new UserBanModel(
      data.userId!,
      data.isBanned,
      data.banReason,
      DateGenerator.generate(),
    );
  }
  public static createEmpty(userId: string): UserBanModel {
    return new UserBanModel(userId, false, '<none>', DateGenerator.generate());
  }
}
