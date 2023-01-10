import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionInputModel } from './question.input.model';
import IdGenerator from '../../../common/utils/id.generator';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 500,
    nullable: false,
    collation: 'C',
  })
  body: string;

  @Column({
    type: 'character varying',
    array: true,
    length: 500,
    nullable: false,
    collation: 'C',
  })
  answers: string[];

  @Column({ type: 'boolean', nullable: false })
  published: boolean;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  public static create(data: QuestionInputModel): Question {
    const question = new Question();
    question.id = IdGenerator.generate();
    question.body = data.body;
    question.answers = [...data.correctAnswers];
    question.published = false;
    question.createdAt = new Date();
    question.updatedAt = new Date(question.createdAt);
    return question;
  }

  public setPublished(published: boolean) {
    if (this.published === published) return;
    this.published = published;
    this.updatedAt = new Date();
  }

  public update(data: QuestionInputModel) {
    this.body = data.body;
    this.answers = [...data.correctAnswers];
    this.updatedAt = new Date();
  }
}
