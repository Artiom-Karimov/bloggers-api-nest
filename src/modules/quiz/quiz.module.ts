import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './typeorm/models/question';
import { QuestionRepository } from './interfaces/question.repository';
import { OrmQuestionRepository } from './typeorm/orm.question.repository';
import { QuestionQueryRepository } from './interfaces/question.query.repository';
import { OrmQuestionQueryRepository } from './typeorm/orm.question.query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [
    {
      provide: QuestionRepository,
      useClass: OrmQuestionRepository,
    },
    {
      provide: QuestionQueryRepository,
      useClass: OrmQuestionQueryRepository,
    },
  ],
})
export class QuizModule { }
