import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserStatsQuery } from '../queries/get.user.stats.query';
import { QuizStatsQueryRepository } from '../../interfaces/quiz.stats.query.repository';
import { QuizStatsViewModel } from '../../models/view/quiz.stats.view.model';

@QueryHandler(GetUserStatsQuery)
export class GetUserStatsHandler implements IQueryHandler<GetUserStatsQuery> {
  constructor(private readonly repo: QuizStatsQueryRepository) { }

  async execute(query: GetUserStatsQuery): Promise<QuizStatsViewModel> {
    return this.repo.get(query.userId);
  }
}
