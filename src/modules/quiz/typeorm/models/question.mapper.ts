import { QuestionViewModel } from '../../models/question.view.model';
import { Question } from './question';

export class QuestionMapper {
  public static toView(q: Question): QuestionViewModel {
    return new QuestionViewModel(
      q.id,
      q.body,
      q.answers,
      q.published,
      q.createdAt.toISOString(),
      q.updatedAt ? q.updatedAt.toISOString() : null,
    );
  }
}
