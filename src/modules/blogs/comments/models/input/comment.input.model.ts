import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export default class CommentInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(20)
  @MaxLength(300)
  @ApiProperty({ minLength: 20, maxLength: 300 })
  content: string;
}
