import { AnswerInputModel } from '../../models/input/answer.input.model';

export class SendQuizAnswerCommand {
  constructor(public userId: string, public data: AnswerInputModel) { }
}
