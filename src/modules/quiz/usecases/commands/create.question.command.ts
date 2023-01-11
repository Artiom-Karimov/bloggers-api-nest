import { QuestionInputModel } from '../../models/question.input.model';

export class CreateQuestionCommand {
  constructor(public data: QuestionInputModel) { }
}
