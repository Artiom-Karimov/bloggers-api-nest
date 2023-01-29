import { Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export default class LoginInputModel {
  @Matches(regex.email)
  @ApiProperty()
  loginOrEmail: string;

  @Matches(regex.password)
  @ApiProperty()
  password: string;
}
