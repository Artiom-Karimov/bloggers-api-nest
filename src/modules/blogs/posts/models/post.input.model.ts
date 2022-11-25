import { Transform, TransformFnParams } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export default class PostInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(100)
  shortDescription: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(1000)
  content: string;
}
