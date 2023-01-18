import { Injectable } from '@nestjs/common';
import { Quiz } from '../typeorm/models/quiz';

@Injectable()
export abstract class QuizRepository {
  public abstract hasCurrentGame(userId: string): Promise<boolean>;
  public abstract getPendingGame(): Promise<Quiz>;
  public abstract save(quiz: Quiz): Promise<boolean>;
}
