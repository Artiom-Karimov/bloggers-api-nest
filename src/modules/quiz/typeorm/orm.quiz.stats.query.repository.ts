import { InjectRepository } from '@nestjs/typeorm';
import { QuizStatsQueryRepository } from '../interfaces/quiz.stats.query.repository';
import { QuizStatsViewModel } from '../models/view/quiz.stats.view.model';
import { QuizStats } from '../models/domain/quiz.stats';
import { Repository } from 'typeorm';

export class OrmQuizStatsQueryRepository extends QuizStatsQueryRepository {
  constructor(
    @InjectRepository(QuizStats) private readonly repo: Repository<QuizStats>,
  ) {
    super();
  }

  public async get(userId: string): Promise<QuizStatsViewModel> {
    try {
      const stats = await this.repo.findOne({
        where: { userId },
      });
      return new QuizStatsViewModel(stats);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
