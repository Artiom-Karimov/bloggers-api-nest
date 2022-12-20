import { IsEmail, Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';

export default class UserInputModel {
  @Matches(regex.login)
  login: string;

  @IsEmail()
  email: string;

  @Matches(regex.password)
  password: string;
}
