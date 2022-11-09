import { MaxLength, MinLength } from 'class-validator';

export default class NewPasswordInputModel {
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @MinLength(10)
  @MaxLength(200)
  recoveryCode: string;
}
