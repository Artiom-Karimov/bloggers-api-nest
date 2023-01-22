import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';
import { User } from '../../../users/typeorm/models/user';
import { Question } from './question';
import IdGenerator from '../../../../common/utils/id.generator';
import { AnswerInfo } from '../view/quiz.view.model';
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
  })
  questions: QuizQuestion[];

  @OneToMany(() => QuizParticipant, (p) => p.quiz, {
    eager: true,
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
  public fixRelations(): Quiz {
    for (const q of this.questions) {
      q.fixRelations(this);
    }
    for (const p of this.participants) {
      p.fixRelations(this);
    }
    this.sortChildren();

    return this;
  }

  public addParticipant(user: User) {
    if (!user) throw new Error('quiz should be created with a user');
    if (!this.participants) this.participants = [];
    if (this.participants.length === config.playerAmount) {
      throw new Error(
        `quiz cannot take more than ${config.playerAmount} users`,
      );
    }

    this.participants.push(QuizParticipant.create(user, this));
    if (this.participants.length === config.playerAmount) {
      this.startedAt = new Date();
    }
  }
  public acceptAnswer(userId: string, answer: string): AnswerInfo {
    if (this.participants.length !== config.playerAmount) {
      throw new Error('there is not enough players in game');
    }
    const user = this.participants.find((p) => p.userId === userId);
    if (!user) throw new Error('user is not in current game');
    const result = user.acceptAnswer(answer);

    this.checkIfGameEnded();

    return result;
  }

  protected mapQuestions(questions: Question[]) {
    if (!questions) throw new Error('quiz should contain questions');
    if (!this.questions) this.questions = [];
    if (questions.length !== config.questionAmount) {
      throw new Error(`quiz should contain ${config.questionAmount} questions`);
    }

    questions.forEach((q, i) => {
      this.questions.push(QuizQuestion.create(this, q, i + 1));
    });
  }
  protected checkIfGameEnded() {
    for (const p of this.participants) {
      if (!p.allAnswersMade()) return;
    }

    this.endedAt = new Date();
    this.assignTimeBonus();
    this.assignWinner();
  }
  protected assignWinner() {
    let winner: QuizParticipant;
    for (const p of this.participants) {
      if (!winner) {
        winner = p;
        continue;
      }
      if (p.score > winner.score) {
        winner = p;
      }
    }

    for (const p of this.participants) {
      if (p.id === winner.id) p.isWinner = true;
      else p.isWinner = false;
    }
  }
  protected assignTimeBonus() {
    let fastest: QuizParticipant;
    for (const p of this.participants) {
      if (!fastest) {
        fastest = p;
        continue;
      }
      if (p.lastAnswerTime() < fastest.lastAnswerTime()) {
        fastest = p;
      }
    }
    fastest.score++;
  }
  protected sortChildren() {
    this.questions?.sort((a, b) => {
      return a.questionOrder - b.questionOrder;
    });
    this.participants.sort((a, b) => {
      return a.addedAt.getTime() - b.addedAt.getTime();
    });
  }
}
