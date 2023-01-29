import { ApiProperty } from '@nestjs/swagger';

export default class SessionViewModel {
  @ApiProperty()
  public ip: string;
  @ApiProperty()
  public title: string;
  @ApiProperty()
  public lastActiveDate: string;
  @ApiProperty()
  public deviceId: string;

  constructor(
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
  ) {
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.deviceId = deviceId;
  }
}
