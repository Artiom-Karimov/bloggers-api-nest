import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';
import { User } from '../../../users/typeorm/models/user';
import { Question } from './question';
import IdGenerator from '../../../../common/utils/id.generator';
import { AnswerInfo } from '../../models/view/quiz.view.model';
import * as config from '../../../../config/quiz';

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

  @OneToMany(() => QuizQuestion, (qn) => qn.quiz, {
    eager: true,
    cascade: true,
  })
  questions: QuizQuestion[];

  @OneToMany(() => QuizParticipant, (p) => p.quiz, {
    eager: true,
    cascade: true,
  })
  participants: QuizParticipant[];

  public static create(firstParticipant: User, questions: Question[]): Quiz {
    const quiz = new Quiz();
    quiz.id = IdGenerator.generate();
    quiz.createdAt = new Date();
    quiz.addParticipant(firstParticipant);
    quiz.mapQuestions(questions);
    return quiz;
  }
  public addParticipant(user: User) {
    if (!this.participants) this.participants = [];
    if (this.participants.length === config.playerAmount) {
      throw new Error(
        `quiz cannot take more than ${config.playerAmount} users`,
      );
    }

    this.participants.push(QuizParticipant.create(user, this));
  }
  public acceptAnswer(userId: string, answer: string): AnswerInfo {
    if (this.participants.length !== config.playerAmount) {
      throw new Error('there is not enough players in game');
    }
    const user = this.participants.find((p) => p.userId === userId);
    if (!user) throw new Error('user is not in current game');
    return user.acceptAnswer(answer);
  }

  protected mapQuestions(questions: Question[]) {
    if (!this.questions) this.questions = [];
    if (questions.length !== config.questionAmount) {
      throw new Error(`quiz must contain ${config.questionAmount} questions`);
    }

    questions.forEach((q, i) => {
      this.questions.push(QuizQuestion.create(this, q, i + 1));
    });
  }
}
