import PageViewModel from '../../../common/models/page.view.model';
import { GetQuestionsQuery } from '../models/get.questions.query';
import { QuestionViewModel } from '../models/question.view.model';

export abstract class QuestionQueryRepository {
  public abstract getQuestions(
    params: GetQuestionsQuery,
  ): Promise<PageViewModel<QuestionViewModel>>;
}
