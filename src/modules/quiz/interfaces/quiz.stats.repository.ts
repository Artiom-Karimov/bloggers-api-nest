import { QuizStats } from '../models/domain/quiz.stats';

export abstract class QuizStatsRepository {
  public abstract get(userId: string): Promise<QuizStats | undefined>;

  public abstract getMany(userIds: string[]): Promise<QuizStats[] | undefined>;

  public abstract createOrUpdate(stats: QuizStats): Promise<string>;

  public abstract createOrUpdateMany(stats: QuizStats[]): Promise<boolean>;
}
