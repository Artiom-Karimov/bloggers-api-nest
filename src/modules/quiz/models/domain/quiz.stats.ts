import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../users/typeorm/models/user';
import { Quiz } from './quiz';
import { QuizStatus } from './quiz.status';
import { QuizParticipant } from './quiz.participant';
import { ParticipantStatus } from './participant.status';

@Entity()
export class QuizStats {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('integer')
  sumScore: number;

  @Column('integer')
  avgScores: number;

  @Column('integer')
  gamesCount: number;

  @Column('integer')
  winsCount: number;

  @Column('integer')
  lossesCount: number;

  @Column('integer')
  drawsCount: number;

  public static fromQuiz(quiz: Quiz): QuizStats[] {
    if (quiz?.status !== QuizStatus.Finished) return null;
    return quiz.participants.map((p) => QuizStats.fromParticipant(p));
  }

  public static fromParticipant(participant: QuizParticipant): QuizStats {
    const stats = new QuizStats();
    stats.user = participant.user;

    stats.sumScore =
      participant.status === ParticipantStatus.Lose ? 0 : participant.score;
    stats.avgScores =
      participant.status === ParticipantStatus.Lose ? 0 : participant.score;

    stats.gamesCount = 1;

    stats.winsCount = participant.status === ParticipantStatus.Win ? 1 : 0;
    stats.lossesCount = participant.status === ParticipantStatus.Lose ? 1 : 0;
    stats.drawsCount = participant.status === ParticipantStatus.Draw ? 1 : 0;

    return stats;
  }

  public appendNewGame(newGameStats: QuizStats): QuizStats {
    this.sumScore += newGameStats.sumScore;
    this.gamesCount += newGameStats.gamesCount;
    this.avgScores = this.sumScore / this.gamesCount;
    this.winsCount += newGameStats.winsCount;
    this.lossesCount += newGameStats.lossesCount;
    this.drawsCount += newGameStats.drawsCount;

    return this;
  }
}
