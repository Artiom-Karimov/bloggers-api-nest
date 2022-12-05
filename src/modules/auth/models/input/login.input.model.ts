import { MaxLength, MinLength } from 'class-validator';

export default class LoginInputModel {
  @MinLength(3)
  @MaxLength(100)
  loginOrEmail: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}
