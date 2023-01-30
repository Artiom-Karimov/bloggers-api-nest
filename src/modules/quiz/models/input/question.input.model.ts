import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';

export class QuestionInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(10, 500)
  @ApiProperty({ minLength: 10, maxLength: 500 })
  body: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Length(1, 500, { each: true })
  @ApiProperty({ maxLength: 500, type: 'string', isArray: true })
  correctAnswers: string[];
}
