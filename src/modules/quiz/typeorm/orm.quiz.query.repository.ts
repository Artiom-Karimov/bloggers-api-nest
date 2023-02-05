import { Injectable } from '@nestjs/common';
import { QuizViewModel } from '../models/view/quiz.view.model';
import { QuizQueryRepository } from '../interfaces/quiz.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../models/domain/quiz';
import { In, IsNull, Not, Repository, SelectQueryBuilder } from 'typeorm';
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
    try {
      const result = await this.loadPage(userId, params);
      return result;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
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

  private async loadPage(
    userId: string,
    params: GetGamesQueryParams,
  ): Promise<PageViewModel<QuizViewModel>> {
    const page = new PageViewModel<QuizViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );

    const builder = this.getQuizQueryBuilder(userId, params);
    console.log(builder.getSql());

    const [games, count] = await builder
      .limit(page.pageSize)
      .offset(page.calculateSkip())
      .getManyAndCount();

    page.setTotalCount(count);

    await this.loadPlayers(games);
    return page.add(...games.map((q) => QuizMapper.toView(q)));
  }

  private getQuizQueryBuilder(
    userId: string,
    params: GetGamesQueryParams,
  ): SelectQueryBuilder<Quiz> {
    return this.repo
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'q')
      .leftJoinAndSelect('q.question', 'qq')
      .leftJoin('quiz.participants', 'p')
      .where('p."userId" = :userId', { userId })
      .orderBy(`quiz."${params.sortBy}"`, params.sortDirection);
  }

  private async loadPlayers(games: Quiz[]): Promise<void> {
    const ids = games.map((g) => g.id);
    const result = await this.participantRepo.find({
      where: { quizId: In(ids) },
      loadEagerRelations: true,
    });

    for (const p of result) {
      const game = games.find((g) => g.id === p.quizId);
      if (!game)
        throw new Error("retrieving game list from db: wrong player's quizId");
      if (!game.participants) game.participants = [];

      game.participants.push(p);
    }
  }
}
