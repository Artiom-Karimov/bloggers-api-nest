import { Injectable } from '@nestjs/common';
import { QuizViewModel } from '../models/view/quiz.view.model';
import { GetGamesQueryParams } from '../models/input/get.games.query.params';
import PageViewModel from '../../../common/models/page.view.model';

@Injectable()
export abstract class QuizQueryRepository {
  public abstract getUserGames(
    userId: string,
    params: GetGamesQueryParams,
  ): Promise<PageViewModel<QuizViewModel>>;
  public abstract getGame(quizId: string): Promise<QuizViewModel>;
  public abstract getCurrentGame(userId: string): Promise<QuizViewModel>;
}
