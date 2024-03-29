import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/domain/question';
import { QuestionRepository } from './interfaces/question.repository';
import { OrmQuestionRepository } from './typeorm/orm.question.repository';
import { QuestionQueryRepository } from './interfaces/question.query.repository';
import { OrmQuestionQueryRepository } from './typeorm/orm.question.query.repository';
import { CreateQuestionHandler } from './usecases/handlers/create.qustion.handler';
import { DeleteQuestionHandler } from './usecases/handlers/delete.question.handler';
import { PublishQuestionHandler } from './usecases/handlers/publish.question.handler';
import { UpdateQuestionHandler } from './usecases/handlers/update.question.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { Quiz } from './models/domain/quiz';
import { QuizQuestion } from './models/domain/quiz.question';
import { QuizParticipant } from './models/domain/quiz.participant';
import { QuizAnswer } from './models/domain/quiz.answer';
import { QuizRepository } from './interfaces/quiz.repository';
import { OrmQuizRepository } from './typeorm/orm.quiz.repository';
import { QuizQueryRepository } from './interfaces/quiz.query.repository';
import { OrmQuizQueryRepository } from './typeorm/orm.quiz.query.repository';
import { ConnectToQuizHandler } from './usecases/handlers/connect.to.quiz.handler';
import { GetCurrentGameHandler } from './usecases/handlers/get.current.game.handler';
import { SendQuizAnswerHandler } from './usecases/handlers/send.quiz.answer.handler';
import { GetGameHandler } from './usecases/handlers/get.game.handler';
import { QuizController } from './quiz.controller';
import { UsersModule } from '../users/users.module';
import { GetUserGamesHandler } from './usecases/handlers/get.user.games.handler';
import { QuizStats } from './models/domain/quiz.stats';
import { QuizStatsRepository } from './interfaces/quiz.stats.repository';
import { OrmQuizStatsRepository } from './typeorm/orm.quiz.stats.repository';
import { QuizStatsQueryRepository } from './interfaces/quiz.stats.query.repository';
import { OrmQuizStatsQueryRepository } from './typeorm/orm.quiz.stats.query.repository';
import { GetUserStatsHandler } from './usecases/handlers/get.user.stats.handler';
import { SaveQuizStatsHandler } from './usecases/handlers/save.quiz.stats.handler';

const commandHandlers = [
  CreateQuestionHandler,
  DeleteQuestionHandler,
  PublishQuestionHandler,
  UpdateQuestionHandler,
  ConnectToQuizHandler,
  SendQuizAnswerHandler,
  GetCurrentGameHandler,
  GetUserGamesHandler,
  GetGameHandler,
  SaveQuizStatsHandler,
  GetUserStatsHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Quiz,
      QuizQuestion,
      QuizParticipant,
      QuizAnswer,
      QuizStats,
    ]),
    CqrsModule,
    UsersModule,
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
    {
      provide: QuizRepository,
      useClass: OrmQuizRepository,
    },
    {
      provide: QuizQueryRepository,
      useClass: OrmQuizQueryRepository,
    },
    {
      provide: QuizStatsRepository,
      useClass: OrmQuizStatsRepository,
    },
    {
      provide: QuizStatsQueryRepository,
      useClass: OrmQuizStatsQueryRepository,
    },
    ...commandHandlers,
  ],
  controllers: [QuizController],
  exports: [QuestionQueryRepository],
})
export class QuizModule { }
