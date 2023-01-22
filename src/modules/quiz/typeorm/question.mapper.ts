import { QuestionViewModel } from '../models/view/question.view.model';
import { Question } from '../models/domain/question';

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
