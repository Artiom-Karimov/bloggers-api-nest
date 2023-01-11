import { QuestionInputModel } from '../../models/question.input.model';

export class UpdateQuestionCommand {
  constructor(public id: string, public data: QuestionInputModel) { }
}
