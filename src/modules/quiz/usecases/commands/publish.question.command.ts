import { QuestionPublishModel } from '../../models/question.publish.model';

export class PublishQuestionCommand {
  constructor(public id: string, public data: QuestionPublishModel) { }
}
