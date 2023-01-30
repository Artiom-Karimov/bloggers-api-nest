import { ApiProperty } from '@nestjs/swagger';
import UserBanViewModel from './user.ban.view.model';

export default class UserViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public login: string;
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public createdAt: string;
  @ApiProperty()
  public banInfo: UserBanViewModel;

  constructor(
    id: string,
    login: string,
    email: string,
    createdAt: string,
    banInfo: UserBanViewModel,
  ) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
    this.banInfo = banInfo;
  }
}
