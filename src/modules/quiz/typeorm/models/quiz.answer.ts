import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';
import { AnswerInfo } from '../../models/view/quiz.view.model';

@Entity()
@Index(['questionId', 'participantId'], { unique: true })
export class QuizAnswer {
  @PrimaryColumn({ type: 'uuid' })
  questionId: string;
  @PrimaryColumn({ type: 'uuid' })
  participantId: string;

  @ManyToOne(() => QuizQuestion, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'questionId' })
  question: QuizQuestion;

  @ManyToOne(() => QuizParticipant, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'participantId' })
  participant: QuizParticipant;

  @Column({ type: 'character varying', nullable: true })
  answer: string;

  @Column({ type: 'boolean', nullable: false })
  isCorrect: boolean;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  public static create(
    participant: QuizParticipant,
    question: QuizQuestion,
    answer: string,
  ): QuizAnswer {
    const a = new QuizAnswer();
    a.question = question;
    a.participant = participant;
    a.answer = answer;
    a.createdAt = new Date();
    a.isCorrect = question.checkAnswer(answer);
    return a;
  }

  public getInfo(): AnswerInfo {
    return new AnswerInfo(
      this.question.questionId,
      this.isCorrect ? 'Correct' : 'Incorrect',
      this.createdAt.toISOString(),
    );
  }
}
