import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, MaxLength, MinLength } from 'class-validator';

export default class UserBanInputModel {
  @IsBoolean()
  @ApiProperty()
  isBanned: boolean;

  @MinLength(20)
  @MaxLength(1000)
  @ApiProperty({ minLength: 20, maxLength: 1000 })
  banReason: string;
}
