import { QuestionInputModel } from '../../models/input/question.input.model';

export class UpdateQuestionCommand {
  constructor(public id: string, public data: QuestionInputModel) { }
}
