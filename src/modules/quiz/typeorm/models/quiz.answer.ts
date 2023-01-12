import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { User } from '../../../users/typeorm/models/user';

@Entity()
@Index(['questionId', 'userId'], { unique: true })
export class QuizAnswer {
  @Column({ type: 'uuid' })
  questionId: string;
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => QuizQuestion, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'questionId' })
  question: QuizQuestion;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'character varying', nullable: true })
  answer: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;
}
