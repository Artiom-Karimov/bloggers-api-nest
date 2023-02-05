import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizQueryRepository } from '../../interfaces/quiz.query.repository';
import { QuizViewModel } from '../../models/view/quiz.view.model';
import { GetUserGamesQuery } from '../queries/get.user.games.query';
import PageViewModel from '../../../../common/models/page.view.model';

@QueryHandler(GetUserGamesQuery)
export class GetUserGamesHandler implements IQueryHandler<GetUserGamesQuery> {
  constructor(private readonly repo: QuizQueryRepository) { }

  async execute(
    query: GetUserGamesQuery,
  ): Promise<PageViewModel<QuizViewModel>> {
    return this.repo.getUserGames(query.userId, query.params);
  }
}
