import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, MaxLength, MinLength, Validate } from 'class-validator';
import { BlogIdValidator } from './blog.id.validator';
import { ApiProperty } from '@nestjs/swagger';

export default class BlogUserBanInputModel {
  @IsBoolean()
  @ApiProperty()
  isBanned: boolean;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(20)
  @MaxLength(500)
  @ApiProperty({ minLength: 20, maxLength: 500 })
  banReason: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Validate(BlogIdValidator)
  @ApiProperty()
  blogId: string;
}
