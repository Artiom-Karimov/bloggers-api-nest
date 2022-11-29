import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, MaxLength, MinLength, Validate } from 'class-validator';
import { BlogIdValidator } from './blog.id.validator';

export default class BlogUserBanInputModel {
  @IsBoolean()
  isBanned: boolean;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(20)
  @MaxLength(500)
  banReason: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Validate(BlogIdValidator)
  blogId: string;
}
