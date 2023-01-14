import { IsString, Length } from 'class-validator';

export class AnswerInputModel {
  @IsString()
  @Length(1, 500)
  answer: string;
}
