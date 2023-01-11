import { IsBoolean } from 'class-validator';

export class QuestionPublishModel {
  @IsBoolean()
  published: boolean;
}
