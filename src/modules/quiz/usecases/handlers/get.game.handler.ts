import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetGameQuery } from '../queries/get.game.query';
import { QuizQueryRepository } from '../../interfaces/quiz.query.repository';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { QuizViewModel } from '../../models/view/quiz.view.model';

@QueryHandler(GetGameQuery)
export class GetGameHandler implements IQueryHandler<GetGameQuery> {
  constructor(private readonly repo: QuizQueryRepository) { }

  async execute(query: GetGameQuery): Promise<QuizViewModel> {
    const game = await this.repo.getGame(query.quizId);
    if (!game) throw new NotFoundException('game not found');

    const userInGame =
      game.firstPlayerProgress.player.id === query.userId ||
      game.secondPlayerProgress.player.id;

    if (!userInGame)
      throw new ForbiddenException("user is not in game's player list");

    return game;
  }
}
