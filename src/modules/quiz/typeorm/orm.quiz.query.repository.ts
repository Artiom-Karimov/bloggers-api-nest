import { Injectable } from '@nestjs/common';
import { QuizViewModel } from '../models/view/quiz.view.model';
import { QuizQueryRepository } from '../interfaces/quiz.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../models/domain/quiz';
import { IsNull, Repository } from 'typeorm';
import { QuizMapper } from './quiz.mapper';
import { QuizParticipant } from '../models/domain/quiz.participant';
import { GetGamesQueryParams } from '../models/input/get.games.query.params';
import PageViewModel from '../../../common/models/page.view.model';

@Injectable()
export class OrmQuizQueryRepository extends QuizQueryRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repo: Repository<Quiz>,
    @InjectRepository(QuizParticipant)
    private readonly participantRepo: Repository<QuizParticipant>,
  ) {
    super();
  }

  public async getUserGames(
    userId: string,
    params: GetGamesQueryParams,
  ): Promise<PageViewModel<QuizViewModel>> {
    throw new Error('not implemented');
  }
  public async getGame(quizId: string): Promise<QuizViewModel> {
    const game = await this.repo.findOne({ where: { id: quizId } });
    return game ? QuizMapper.toView(game) : undefined;
  }
  public async getCurrentGame(userId: string): Promise<QuizViewModel> {
    const participant = await this.participantRepo.findOne({
      where: { userId, isWinner: IsNull() },
      loadEagerRelations: false,
    });

    if (!participant) return undefined;
    return this.getGame(participant.quizId);
  }
}
