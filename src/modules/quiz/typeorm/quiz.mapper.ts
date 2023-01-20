import { Quiz } from '../models/domain/quiz';
import { QuizParticipant } from '../models/domain/quiz.participant';
import { QuizQuestion } from '../models/domain/quiz.question';
import {
  PlayerInfo,
  PlayerProgress,
  QuestionInfo,
  QuizViewModel,
} from '../models/view/quiz.view.model';

export class QuizMapper {
  public static toView(quiz: Quiz): QuizViewModel {
    quiz.sortChildren();
    return new QuizViewModel(
      quiz.id,
      QuizMapper.getPlayer(quiz.participants[0]),
      QuizMapper.getPlayer(quiz.participants[1] ?? null),
      QuizMapper.getQuestions(quiz.questions),
      QuizMapper.getStatus(quiz),
      quiz.createdAt.toISOString(),
      quiz.startedAt ? quiz.startedAt.toISOString() : null,
      quiz.endedAt ? quiz.endedAt.toISOString() : null,
    );
  }
  private static getPlayer(player: QuizParticipant | null): PlayerProgress {
    if (!player) return null;
    return new PlayerProgress(
      player.answers.map((a) => a.getInfo()),
      QuizMapper.getPlayerInfo(player),
      player.score,
    );
  }
  private static getPlayerInfo(player: QuizParticipant): PlayerInfo {
    return new PlayerInfo(player.user.id, player.user.login);
  }
  private static getQuestions(questions: QuizQuestion[]): QuestionInfo[] {
    return questions.map((q) => {
      return new QuestionInfo(q.question.id, q.question.body);
    });
  }
  private static getStatus(
    quiz: Quiz,
  ): 'PendingSecondPlayer' | 'Active' | 'Finished' {
    if (quiz.endedAt) return 'Finished';
    if (quiz.startedAt) return 'Active';
    return 'PendingSecondPlayer';
  }
}
