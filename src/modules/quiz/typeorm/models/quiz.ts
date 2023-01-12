import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';

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

  @OneToMany(() => QuizQuestion, (qn) => qn.quiz)
  questions: QuizQuestion[];

  @OneToMany(() => QuizParticipant, (p) => p.quiz)
  participants: QuizParticipant[];
}
