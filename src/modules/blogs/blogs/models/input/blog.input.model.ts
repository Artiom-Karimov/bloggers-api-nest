import { Transform, TransformFnParams } from 'class-transformer';
import { Matches, MinLength, MaxLength } from 'class-validator';
import { regex } from '../../../../../common/utils/validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export default class BlogInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(regex.blogName)
  @ApiProperty({ maxLength: 15 })
  name: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(500)
  @ApiProperty({ minLength: 3, maxLength: 500 })
  description: string;

  @MaxLength(100)
  @Matches(regex.httpsUrl)
  @ApiProperty({ example: 'https://example.com/123' })
  websiteUrl: string;
}
