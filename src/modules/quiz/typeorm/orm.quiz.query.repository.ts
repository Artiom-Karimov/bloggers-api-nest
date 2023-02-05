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
import { QuizQuestion } from '../models/domain/quiz.question';

@Injectable()
export class OrmQuizQueryRepository extends QuizQueryRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repo: Repository<Quiz>,
    @InjectRepository(QuizParticipant)
    private readonly participantRepo: Repository<QuizParticipant>,
    @InjectRepository(QuizQuestion)
    private readonly questionRepo: Repository<QuizQuestion>,
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

    const [games, count] = await builder
      .limit(page.pageSize)
      .offset(page.calculateSkip())
      .getManyAndCount();

    page.setTotalCount(count);

    await this.loadQuestions(games);
    await this.loadPlayers(games);

    return page.add(...games.map((q) => QuizMapper.toView(q)));
  }

  private getQuizQueryBuilder(
    userId: string,
    params: GetGamesQueryParams,
  ): SelectQueryBuilder<Quiz> {
    const builder = this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.participants', 'p')
      .where('p."userId" = :userId', { userId });

    return this.addOrderBy(builder, params);
  }

  private addOrderBy(
    builder: SelectQueryBuilder<Quiz>,
    params: GetGamesQueryParams,
  ): SelectQueryBuilder<Quiz> {
    const { sortBy, sortDirection } = params;

    if (sortBy === 'status') {
      return builder
        .orderBy(`quiz."status"`, sortDirection)
        .addOrderBy(`quiz."createdAt"`, 'DESC');
    }
    if (sortBy === 'startGameDate') {
      return builder
        .orderBy(`quiz."startedAt"`, sortDirection)
        .addOrderBy(`quiz."createdAt"`, 'DESC');
    }
    if (sortBy === 'finishGameDate') {
      return builder
        .orderBy(`quiz."endedAt"`, sortDirection)
        .addOrderBy(`quiz."createdAt"`, 'DESC');
    }
    return builder.orderBy(`quiz."createdAt"`, params.sortDirection);
  }

  private async loadQuestions(games: Quiz[]): Promise<void> {
    const ids = games.map((g) => g.id);
    const result = await this.questionRepo.find({
      where: { quizId: In(ids) },
      loadEagerRelations: true,
    });

    for (const q of result) {
      const game = games.find((g) => g.id === q.quizId);
      if (!game)
        throw new Error(
          "retrieving game list from db: wrong question's quizId",
        );
      if (!game.questions) game.questions = [];

      game.questions.push(q);
    }
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
