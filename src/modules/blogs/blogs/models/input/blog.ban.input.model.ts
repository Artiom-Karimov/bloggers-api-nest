import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export default class BlogBanInputModel {
  @IsBoolean()
  @ApiProperty()
  isBanned: boolean;
}
