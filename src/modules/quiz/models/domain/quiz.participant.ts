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
import IdGenerator from '../../../../common/utils/id.generator';
import { AnswerInfo } from '../view/player.progress';
import { ParticipantStatus } from './participant.status';

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

  @Column({
    type: 'character varying',
    length: 32,
    collation: 'C',
    enum: ParticipantStatus,
    nullable: true,
  })
  status: ParticipantStatus | null;

  @Column({ type: 'timestamptz', nullable: false })
  addedAt: Date;

  @OneToMany(() => QuizAnswer, (a) => a.participant, {
    eager: true,
  })
  answers: QuizAnswer[];

  public static create(user: User, quiz: Quiz): QuizParticipant {
    const qp = new QuizParticipant();
    qp.id = IdGenerator.generate();
    qp.quiz = quiz;
    qp.quizId = quiz.id;
    qp.user = user;
    qp.userId = user.id;
    qp.score = 0;
    qp.addedAt = new Date();
    qp.status = ParticipantStatus.Unknown;
    return qp;
  }

  public acceptAnswer(answer: string): AnswerInfo | null {
    if (!this.answers) this.answers = [];
    if (this.allAnswersMade()) return null;
    const question = this.quiz.questions[this.answers.length];
    const ans = QuizAnswer.create(this, question, answer);
    this.answers.push(ans);
    if (ans.isCorrect) this.score++;
    return ans.getInfo();
  }
  public allAnswersMade(): boolean {
    if (!this.answers) return false;
    return this.answers.length === config.questionAmount;
  }
  public lastAnswerTime(): Date {
    if (!this.allAnswersMade()) throw new Error('there is no last answer');
    let result: Date;

    for (const a of this.answers) {
      if (!result) {
        result = a.createdAt;
        continue;
      }
      if (a.createdAt > result) {
        result = a.createdAt;
      }
    }
    return result;
  }
  public fixRelations(quiz: Quiz) {
    this.quiz = quiz;
    for (const a of this.answers) {
      a.fixRelations(this, quiz.questions);
    }
    this.sortChildren();
  }
  protected sortChildren() {
    this.answers?.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
}
