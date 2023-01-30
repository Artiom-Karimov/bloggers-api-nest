import { Quiz } from '../models/domain/quiz';
import { QuizParticipant } from '../models/domain/quiz.participant';
import {
  QuestionInfo,
  QuizStatus,
  QuizViewModel,
} from '../models/view/quiz.view.model';
import { PlayerInfo, PlayerProgress } from '../models/view/player.progress';

export class QuizMapper {
  public static toView(quiz: Quiz): QuizViewModel {
    quiz.fixRelations();
    return new QuizViewModel(
      quiz.id,
      QuizMapper.getPlayer(quiz.participants[0]),
      QuizMapper.getPlayer(quiz.participants[1] ?? null),
      QuizMapper.getQuestions(quiz),
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
  private static getQuestions(quiz: Quiz): QuestionInfo[] {
    if (quiz.participants.length < 2) return null;
    return quiz.questions.map((q) => {
      return new QuestionInfo(q.question.id, q.question.body);
    });
  }
  private static getStatus(quiz: Quiz): QuizStatus {
    if (quiz.endedAt) return QuizStatus.Finished;
    if (quiz.startedAt) return QuizStatus.Active;
    return QuizStatus.PendingSecondPlayer;
  }
}
