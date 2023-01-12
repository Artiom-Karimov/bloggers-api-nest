import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz';
import { Question } from './question';
import { QuizAnswer } from './quiz.answer';

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

  @ManyToOne(() => Question, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'int', nullable: false })
  questionOrder: number;

  @OneToMany(() => QuizAnswer, (a) => a.question)
  answers: QuizAnswer[];
}
