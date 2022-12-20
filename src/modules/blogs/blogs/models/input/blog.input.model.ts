import { Transform, TransformFnParams } from 'class-transformer';
import { Matches, MinLength, MaxLength } from 'class-validator';
import { regex } from '../../../../../common/utils/validation.regex';

export default class BlogInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(regex.blogName)
  name: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(500)
  description: string;

  @MaxLength(100)
  @Matches(regex.httpsUrl)
  websiteUrl: string;
}
