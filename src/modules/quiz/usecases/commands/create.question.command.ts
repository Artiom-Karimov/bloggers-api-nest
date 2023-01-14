import { QuestionInputModel } from '../../models/input/question.input.model';

export class CreateQuestionCommand {
  constructor(public data: QuestionInputModel) { }
}
