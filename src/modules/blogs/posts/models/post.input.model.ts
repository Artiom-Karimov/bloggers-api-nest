import { Transform, TransformFnParams } from 'class-transformer';
import { Matches, MaxLength, MinLength } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export default class PostInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(regex.postTitle)
  @ApiProperty({ maxLength: 30 })
  title: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  shortDescription: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({ maxLength: 1000 })
  content: string;
}
