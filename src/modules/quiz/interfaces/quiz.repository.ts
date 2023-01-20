import { Injectable } from '@nestjs/common';
import { Quiz } from '../models/domain/quiz';

@Injectable()
export abstract class QuizRepository {
  public abstract hasCurrentGame(userId: string): Promise<boolean>;
  public abstract getCurrentGame(userId: string): Promise<Quiz>;
  public abstract getPendingGame(): Promise<Quiz>;
  public abstract save(quiz: Quiz): Promise<boolean>;
}
