import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { QuizQueryRepository } from '../../interfaces/quiz.query.repository';
import { QuizViewModel } from '../../models/view/quiz.view.model';
import { GetCurrentGameQuery } from '../queries/get.current.game.query';

@QueryHandler(GetCurrentGameQuery)
export class GetCurrentGameHandler
  implements IQueryHandler<GetCurrentGameQuery>
{
  constructor(private readonly repo: QuizQueryRepository) { }

  async execute(query: GetCurrentGameQuery): Promise<QuizViewModel> {
    const game = await this.repo.getCurrentGame(query.userId);
    if (!game) throw new NotFoundException('user has no current game');

    return game;
  }
}
