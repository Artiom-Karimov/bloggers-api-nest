import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';
import { User } from '../../../users/typeorm/models/user';
import { Question } from './question';
import IdGenerator from '../../../../common/utils/id.generator';
import * as config from '../../../../config/quiz';
import { AnswerInfo } from '../view/player.progress';
import { QuizStatus } from './quiz.status';
import { ParticipantStatus } from './participant.status';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @Column({
    type: 'character varying',
    length: 20,
    nullable: false,
    default: 'PendingSecondPlayer',
  })
  status: QuizStatus;

  @OneToMany(() => QuizQuestion, (qn) => qn.quiz, {
    eager: true,
  })
  questions: QuizQuestion[];

  @OneToMany(() => QuizParticipant, (p) => p.quiz, {
    eager: true,
  })
  participants: QuizParticipant[];

  public static create(
    firstParticipant: User,
    questions: Question[],
  ): Quiz | null {
    return new Quiz()
      .initialize()
      .addParticipant(firstParticipant)
      ?.mapQuestions(questions);
  }
  public fixRelations(): Quiz {
    for (const q of this.questions) {
      q.fixRelations(this);
    }
    for (const p of this.participants) {
      p.fixRelations(this);
    }
    this.sortChildren();

    return this;
  }

  public addParticipant(user: User): Quiz | null {
    if (!user) return null;
    if (!this.participants) this.participants = [];
    if (this.participants.length === config.playerAmount) {
      return null;
    }

    this.participants.push(QuizParticipant.create(user, this));
    if (this.participants.length === config.playerAmount) {
      this.startedAt = new Date();
      this.status = QuizStatus.Active;
    }

    return this;
  }
  public acceptAnswer(userId: string, answer: string): AnswerInfo | null {
    if (this.participants.length !== config.playerAmount) return null;
    const user = this.getParticipant(userId);
    if (!user) return null;
    const result = user.acceptAnswer(answer);

    this.endGameIfNeeded();

    return result;
  }
  public getParticipant(userId: string): QuizParticipant | null {
    return this.participants.find((p) => p.userId === userId);
  }

  protected initialize(): Quiz {
    this.id = IdGenerator.generate();
    this.createdAt = new Date();
    this.status = QuizStatus.PendingSecondPlayer;
    return this;
  }
  protected mapQuestions(questions: Question[]): Quiz | null {
    if (!questions) return null;
    if (!this.questions) this.questions = [];
    if (questions.length !== config.questionAmount) {
      return null;
    }

    questions.forEach((q, i) => {
      this.questions.push(QuizQuestion.create(this, q, i + 1));
    });

    return this;
  }
  protected endGameIfNeeded() {
    for (const p of this.participants) {
      if (!p.allAnswersMade()) return;
    }

    this.endedAt = new Date();
    this.status = QuizStatus.Finished;
    this.assignTimeBonus();
    this.assignWinners();
  }
  protected assignWinners() {
    const winnerScore = this.getWinnerScore();
    const winnerStatus = this.winOrDraw(winnerScore);
    this.fillParticipantStatuses(winnerScore, winnerStatus);
  }
  protected getWinnerScore(): number {
    let score = 0;
    for (const p of this.participants) {
      if (p.score > score) {
        score = p.score;
        continue;
      }
    }
    return score;
  }
  protected winOrDraw(score: number): ParticipantStatus {
    let winnersTotal = 0;
    for (const p of this.participants) {
      if (p.score === score) winnersTotal++;
      if (winnersTotal > 1) break;
    }
    if (winnersTotal === 1) return ParticipantStatus.Win;
    return ParticipantStatus.Draw;
  }
  protected fillParticipantStatuses(
    winnerScore: number,
    winnerStatus: ParticipantStatus,
  ): void {
    for (const p of this.participants) {
      if (p.score === winnerScore) p.status = winnerStatus;
      else p.status = ParticipantStatus.Lose;
    }
  }
  protected assignTimeBonus() {
    let fastest: QuizParticipant;
    for (const p of this.participants) {
      if (!fastest) {
        fastest = p;
        continue;
      }
      if (p.lastAnswerTime() < fastest.lastAnswerTime()) {
        fastest = p;
      }
    }
    fastest.score++;
  }
  protected sortChildren() {
    this.questions?.sort((a, b) => {
      return a.questionOrder - b.questionOrder;
    });
    this.participants.sort((a, b) => {
      return a.addedAt.getTime() - b.addedAt.getTime();
    });
  }
}
