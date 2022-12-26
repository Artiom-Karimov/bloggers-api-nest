import { BanUserCreateModel } from '../../admin/commands/commands/ban.user.command';
import { UserBanDto } from './dto/user.ban.dto';

export default class UserBanModel {
  private userId: string;
  private isBanned: boolean;
  private banReason: string | null;
  private banDate: Date | null;

  constructor(data: UserBanDto) {
    this.userId = data.userId;
    this.isBanned = data.isBanned;
    this.banReason = data.banReason;
    this.banDate = data.banDate;
  }
  public toDto(): UserBanDto {
    return new UserBanDto(
      this.userId,
      this.isBanned,
      this.banReason,
      this.banDate,
    );
  }

  public static create(data: BanUserCreateModel): UserBanModel {
    if (!data.userId) throw new Error('You must specify userId for ban');
    return new UserBanModel(
      new UserBanDto(
        data.userId,
        data.isBanned ?? null,
        data.banReason ?? null,
        new Date(),
      ),
    );
  }
  public static createEmpty(userId: string): UserBanModel {
    return new UserBanModel(new UserBanDto(userId, false, null, null));
  }
}
