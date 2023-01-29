import { Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export default class NewPasswordInputModel {
  @Matches(regex.password)
  @ApiProperty({ minLength: 6, maxLength: 20 })
  newPassword: string;

  @Matches(regex.uuid)
  @ApiProperty()
  recoveryCode: string;
}
