import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class EmailInputModel {
  @IsEmail()
  @ApiProperty()
  email: string;
}
