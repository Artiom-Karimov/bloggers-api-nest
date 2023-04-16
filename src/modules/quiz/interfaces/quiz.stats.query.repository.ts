import { QuizStatsViewModel } from '../models/view/quiz.stats.view.model';

export abstract class QuizStatsQueryRepository {
  public abstract get(userId: string): Promise<QuizStatsViewModel>;
}
