import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz';
import { Question } from './question';
import IdGenerator from '../../../../common/utils/id.generator';

@Entity()
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quizId: string;
  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @ManyToOne(() => Question, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'int', nullable: false })
  questionOrder: number;

  public static create(
    quiz: Quiz,
    question: Question,
    questionOrder: number,
  ): QuizQuestion {
    const q = new QuizQuestion();
    q.id = IdGenerator.generate();
    q.quiz = quiz;
    q.question = question;
    q.questionOrder = questionOrder;
    return q;
  }
}
