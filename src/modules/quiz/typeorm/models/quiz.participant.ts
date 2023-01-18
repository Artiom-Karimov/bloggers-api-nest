import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz';
import { User } from '../../../users/typeorm/models/user';
import { QuizAnswer } from './quiz.answer';
import * as config from '../../../../config/quiz';
import { AnswerInfo } from '../../models/view/quiz.view.model';

@Entity()
@Index(['quizId', 'userId'], { unique: true })
export class QuizParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  quizId: string;
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', nullable: false, default: 0 })
  score: number;

  @Column({ type: 'boolean', nullable: true })
  isWinner: boolean | null;

  @OneToMany(() => QuizAnswer, (a) => a.participant, {
    eager: true,
    cascade: true,
  })
  answers: QuizAnswer[];

  public static create(user: User, quiz: Quiz): QuizParticipant {
    const qp = new QuizParticipant();
    qp.quiz = quiz;
    qp.user = user;
    qp.score = 0;
    return qp;
  }
  public acceptAnswer(answer: string): AnswerInfo {
    if (!this.answers) this.answers = [];
    if (this.answers.length === config.questionAmount) {
      throw new Error('all the answers were already sent');
    }
    const question = this.quiz.questions[this.answers.length];
    const ans = QuizAnswer.create(this, question, answer);
    this.answers.push(ans);
    return ans.getInfo();
  }
}
