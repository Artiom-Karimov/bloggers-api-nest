import { Injectable } from '@nestjs/common';
import { Quiz } from '../models/domain/quiz';
import { QuizRepository } from '../interfaces/quiz.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { QuizParticipant } from '../models/domain/quiz.participant';

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
      .setLock('pessimistic_write', undefined, ['quiz']);
  }
}
