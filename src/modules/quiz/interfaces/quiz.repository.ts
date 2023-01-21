import { Injectable } from '@nestjs/common';
import { Quiz } from '../models/domain/quiz';
import { QueryRunner } from 'typeorm';

@Injectable()
export abstract class QuizRepository {
  public abstract getCurrentGameId(userId: string): Promise<string>;
  public abstract startTransaction(): Promise<QueryRunner>;
  public abstract getCurrentGame(
    quizId: string,
    qr: QueryRunner,
  ): Promise<Quiz>;
  public abstract getPendingGame(qr: QueryRunner): Promise<Quiz>;
  public abstract save(quiz: Quiz, qr?: QueryRunner): Promise<boolean>;
}
