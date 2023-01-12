import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz';
import { User } from '../../../users/typeorm/models/user';

@Entity()
@Index(['quizId', 'userId'], { unique: true })
export class QuizParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  quizId: string;
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => Quiz, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', nullable: false, default: 0 })
  score: number;

  @Column({ type: 'boolean', nullable: true })
  isWinner: boolean | null;
}
