import { Transform, TransformFnParams } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';

export class QuestionInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(10, 500)
  body: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Length(1, 500, { each: true })
  correctAnswers: string[];
}
