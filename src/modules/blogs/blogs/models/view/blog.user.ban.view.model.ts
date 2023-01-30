import { ApiProperty } from '@nestjs/swagger';

export class BanInfo {
  @ApiProperty()
  isBanned: boolean;
  @ApiProperty({ nullable: true })
  banDate?: string;
  @ApiProperty({ nullable: true })
  banReason?: string;
}

export default class BlogUserBanViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public login: string;
  @ApiProperty()
  public banInfo: BanInfo;

  constructor(id: string, login: string, banInfo: BanInfo) {
    this.id = id;
    this.login = login;
    this.banInfo = banInfo;
  }
}
