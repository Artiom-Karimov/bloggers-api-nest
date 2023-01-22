import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';
import { AnswerInfo } from '../view/quiz.view.model';
import IdGenerator from '../../../../common/utils/id.generator';

@Entity()
@Index(['questionId', 'participantId'], { unique: true })
export class QuizAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', readonly: true })
  questionId: string;
  @Column({ type: 'uuid', readonly: true })
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

  // So you don't need to save it each time
  isNew: boolean;

  public static create(
    participant: QuizParticipant,
    question: QuizQuestion,
    answer: string,
  ): QuizAnswer {
    const a = new QuizAnswer();
    a.id = IdGenerator.generate();
    a.isNew = true;
    a.question = question;
    a.questionId = question.id;
    a.participant = participant;
    a.participantId = participant.id;
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
  public fixRelations(participant: QuizParticipant, questions: QuizQuestion[]) {
    this.participant = participant;
    this.question = questions.find((q) => q.id === this.questionId);
  }
}
