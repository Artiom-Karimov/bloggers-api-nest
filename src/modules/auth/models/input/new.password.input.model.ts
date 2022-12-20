import { Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';

export default class NewPasswordInputModel {
  @Matches(regex.password)
  newPassword: string;

  @Matches(regex.uuid)
  recoveryCode: string;
}
