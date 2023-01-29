import { ApiProperty } from '@nestjs/swagger';

export default class SessionUserViewModel {
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public login: string;
  @ApiProperty()
  public userId: string;

  constructor(email: string, login: string, userId: string) {
    this.email = email;
    this.login = login;
    this.userId = userId;
  }
}
