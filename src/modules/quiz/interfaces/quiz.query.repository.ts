import { Injectable } from '@nestjs/common';
import { QuizViewModel } from '../models/view/quiz.view.model';

@Injectable()
export abstract class QuizQueryRepository {
  public abstract getGame(quizId: string): Promise<QuizViewModel>;
  public abstract getCurrentGame(userId: string): Promise<QuizViewModel>;
}
