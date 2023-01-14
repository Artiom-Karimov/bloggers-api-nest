import PageViewModel from '../../../common/models/page.view.model';
import { GetQuestionsQuery } from '../models/input/get.questions.query';
import { QuestionViewModel } from '../models/view/question.view.model';

export abstract class QuestionQueryRepository {
  public abstract getQuestions(
    params: GetQuestionsQuery,
  ): Promise<PageViewModel<QuestionViewModel>>;
  public abstract getQuestion(
    id: string,
  ): Promise<QuestionViewModel | undefined>;
}
