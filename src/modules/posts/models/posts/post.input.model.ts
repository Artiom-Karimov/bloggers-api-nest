import { Transform, TransformFnParams } from 'class-transformer';
import { MaxLength, MinLength, Validate, ValidateIf } from 'class-validator';
import { BlogIdValidator } from './blog.id.validator';

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

  @ValidateIf((p) => p.blogId)
  @Validate(BlogIdValidator)
  blogId?: string;

  blogName?: string;
}
