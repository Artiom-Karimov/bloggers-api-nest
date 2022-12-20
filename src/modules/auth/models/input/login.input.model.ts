import { Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';

export default class LoginInputModel {
  @Matches(regex.email)
  loginOrEmail: string;

  @Matches(regex.password)
  password: string;
}
