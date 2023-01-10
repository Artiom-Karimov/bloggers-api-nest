import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './typeorm/models/question';
import { QuestionRepository } from './interfaces/question.repository';
import { OrmQuestionRepository } from './typeorm/orm.question.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [
    {
      provide: QuestionRepository,
      useClass: OrmQuestionRepository,
    },
  ],
})
export class QuizModule { }
