import { Injectable } from '@nestjs/common';
import { Quiz } from '../models/domain/quiz';
import { QuizRepository } from '../interfaces/quiz.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { QuizParticipant } from '../models/domain/quiz.participant';
import { QuizAnswer } from '../models/domain/quiz.answer';
import { QuizQuestion } from '../models/domain/quiz.question';

@Injectable()
export class OrmQuizRepository extends QuizRepository {
  constructor(
    @InjectDataSource()
    private readonly db: DataSource,
  ) {
    super();
  }
  public async getCurrentGameId(userId: string): Promise<string> {
    const result = await this.db.getRepository(QuizParticipant).findOne({
      select: { quizId: true },
      where: { userId, isWinner: IsNull() },
      loadEagerRelations: false,
    });
    return result ? result.quizId : undefined;
  }

  public async startTransaction(): Promise<QueryRunner> {
    const qr = this.db.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    return qr;
  }

  public async getCurrentGame(
    quizId: string,
    runner: QueryRunner,
  ): Promise<Quiz> {
    const result = await this.prepareQuery(runner)
      .where('"quiz"."id" = :quizId', { quizId })
      .getOne();

    return result ? result.fixRelations() : undefined;
  }
  public async getPendingGame(runner: QueryRunner): Promise<Quiz> {
    const result = await this.prepareQuery(runner)
      .where('"quiz"."startedAt" is null')
      .getOne();

    return result ? result.fixRelations() : undefined;
  }
  public async save(quiz: Quiz, runner?: QueryRunner): Promise<boolean> {
    const quizRepo = runner
      ? runner.manager.getRepository(Quiz)
      : this.db.getRepository(Quiz);

    await quizRepo.save(quiz);
    await this.saveChildren(quiz, runner);
    return true;
  }

  private prepareQuery(runner: QueryRunner): SelectQueryBuilder<Quiz> {
    const quizRepo = runner.manager.getRepository(Quiz);
    return quizRepo
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'q')
      .leftJoinAndSelect('quiz.participants', 'p')
      .leftJoinAndSelect('q.question', 'qq')
      .leftJoinAndSelect('p.answers', 'qa')
      .useTransaction(true)
      .setLock('pessimistic_read', undefined, ['quiz']);
  }
  private async saveChildren(quiz: Quiz, runner?: QueryRunner): Promise<void> {
    await this.saveParticipants(quiz, runner);
    await this.saveAnswers(quiz, runner);
    await this.saveQuestions(quiz, runner);
  }
  private async saveParticipants(quiz: Quiz, runner: QueryRunner) {
    const repo = runner
      ? runner.manager.getRepository(QuizParticipant)
      : this.db.getRepository(QuizParticipant);

    await repo.save(quiz.participants);
  }
  private async saveAnswers(quiz: Quiz, runner: QueryRunner) {
    const repo = runner
      ? runner.manager.getRepository(QuizAnswer)
      : this.db.getRepository(QuizAnswer);

    let all = new Array<QuizAnswer>();
    for (const p of quiz.participants) {
      if (p.answers) all.push(...p.answers);
    }
    all = all.filter((a) => a.isNew);
    if (all.length === 0) return;

    await repo.save(all);
  }
  private async saveQuestions(quiz: Quiz, runner: QueryRunner) {
    const repo = runner
      ? runner.manager.getRepository(QuizQuestion)
      : this.db.getRepository(QuizQuestion);

    await repo.save(quiz.questions);
  }
}
