import { ApiProperty } from '@nestjs/swagger';

export default class UserBanViewModel {
  @ApiProperty()
  public isBanned: boolean;
  @ApiProperty({ nullable: true })
  public banDate: string | null;
  @ApiProperty({ nullable: true })
  public banReason: string | null;

  constructor(
    isBanned: boolean,
    banDate: string | null,
    banReason: string | null,
  ) {
    this.isBanned = isBanned;
    this.banDate = banDate;
    this.banReason = banReason;
  }
}
