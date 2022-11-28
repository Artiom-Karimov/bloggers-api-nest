import DateGenerator from '../../../../common/utils/date.generator';
import UserBanInputModel from '../../../admin/models/user.ban.input.model';

export default class UserBanModel {
  constructor(
    public userId: string,
    public isBanned: boolean,
    public banReason: string | null,
    public banDate: string | null,
  ) { }
  public static create(data: UserBanInputModel): UserBanModel {
    if (!data.userId) throw new Error('You must specify userId for ban');
    return new UserBanModel(
      data.userId!,
      data.isBanned ?? null,
      data.banReason ?? null,
      DateGenerator.generate(),
    );
  }
  public static createEmpty(userId: string): UserBanModel {
    return new UserBanModel(userId, false, null, null);
  }
}
