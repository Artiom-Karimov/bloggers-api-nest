import { IsEmail, Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export default class UserInputModel {
  @Matches(regex.login)
  @ApiProperty({ minLength: 3, maxLength: 10 })
  login: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @Matches(regex.password)
  @ApiProperty({ minLength: 6, maxLength: 20 })
  password: string;
}
