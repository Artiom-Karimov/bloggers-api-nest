import { QuestionPublishModel } from '../../models/input/question.publish.model';

export class PublishQuestionCommand {
  constructor(public id: string, public data: QuestionPublishModel) { }
}
