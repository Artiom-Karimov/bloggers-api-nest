import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestion } from './quiz.question';
import { QuizParticipant } from './quiz.participant';
import { User } from '../../../users/typeorm/models/user';
import { Question } from './question';
import IdGenerator from '../../../../common/utils/id.generator';

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
    if (this.participants.length === 2)
      throw new Error('quiz cannot take more than 2 users');

    this.participants.push(QuizParticipant.create(user, this));
  }

  protected mapQuestions(questions: Question[]) {
    if (questions.length !== 5)
      throw new Error('quiz must contain 5 questions');

    if (!this.questions) this.questions = [];

    questions.forEach((q, i) => {
      this.questions.push(QuizQuestion.create(this, q, i + 1));
    });
  }
}
