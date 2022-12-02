import { IsBoolean, MaxLength, MinLength } from 'class-validator';

export default class UserBanInputModel {
  @IsBoolean()
  isBanned: boolean;

  @MinLength(20)
  @MaxLength(1000)
  banReason: string;
}
