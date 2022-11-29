import { Transform, TransformFnParams } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export default class CommentInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
