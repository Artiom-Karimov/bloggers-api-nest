import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './typeorm/models/question';
import { QuestionRepository } from './interfaces/question.repository';
import { OrmQuestionRepository } from './typeorm/orm.question.repository';
import { QuestionQueryRepository } from './interfaces/question.query.repository';
import { OrmQuestionQueryRepository } from './typeorm/orm.question.query.repository';
import { CreateQuestionHandler } from './usecases/handlers/create.qustion.handler';
import { DeleteQuestionHandler } from './usecases/handlers/delete.question.handler';
import { PublishQuestionHandler } from './usecases/handlers/publish.question.handler';
import { UpdateQuestionHandler } from './usecases/handlers/update.question.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { Quiz } from './typeorm/models/quiz';
import { QuizQuestion } from './typeorm/models/quiz.question';
import { QuizParticipant } from './typeorm/models/quiz.participant';
import { QuizAnswer } from './typeorm/models/quiz.answer';

const commandHandlers = [
  CreateQuestionHandler,
  DeleteQuestionHandler,
  PublishQuestionHandler,
  UpdateQuestionHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Quiz,
      QuizQuestion,
      QuizParticipant,
      QuizAnswer,
    ]),
    CqrsModule,
  ],
  providers: [
    {
      provide: QuestionRepository,
      useClass: OrmQuestionRepository,
    },
    {
      provide: QuestionQueryRepository,
      useClass: OrmQuestionQueryRepository,
    },
    ...commandHandlers,
  ],
  exports: [QuestionQueryRepository],
})
export class QuizModule { }
