import { IsEmail } from 'class-validator';

export default class EmailInputModel {
  @IsEmail()
  email: string;
}
