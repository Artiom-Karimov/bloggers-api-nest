import { Transform, TransformFnParams } from 'class-transformer';
import { Matches, MaxLength, MinLength } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';

export default class PostInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(regex.postTitle)
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
