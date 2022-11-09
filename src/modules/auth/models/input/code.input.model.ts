import { MaxLength, MinLength } from 'class-validator';

export default class CodeInputModel {
  @MinLength(10)
  @MaxLength(200)
  code: string;
}
