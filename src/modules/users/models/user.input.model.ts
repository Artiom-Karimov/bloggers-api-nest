import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export default class UserInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(10)
  login: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}
