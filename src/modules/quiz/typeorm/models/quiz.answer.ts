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
    return a;
  }
}
