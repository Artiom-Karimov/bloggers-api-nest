import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import { GetCurrentGameQuery } from './usecases/queries/get.current.game.query';
import { AnswerInfo, QuizViewModel } from './models/view/quiz.view.model';
import { GetGameQuery } from './usecases/queries/get.game.query';
import IdParams from '../../common/models/id.param';
import { ConnectToQuizCommand } from './usecases/commands/connect.to.quiz.command';
import { AnswerInputModel } from './models/input/answer.input.model';
import { SendQuizAnswerCommand } from './usecases/commands/send.quiz.answer.command';
import { HttpCode } from '@nestjs/common/decorators';

@Controller('pair-game-quiz/pairs')
@UseGuards(BearerAuthGuard)
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get('my-current')
  async getCurrent(@User() user: TokenPayload): Promise<QuizViewModel> {
    return this.queryBus.execute(new GetCurrentGameQuery(user.userId));
  }

  @Get(':id')
  async get(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<QuizViewModel> {
    return this.queryBus.execute(new GetGameQuery(params.id, user.userId));
  }

  @Post('connection')
  @HttpCode(200)
  async connect(@User() user: TokenPayload): Promise<QuizViewModel> {
    return this.commandBus.execute(new ConnectToQuizCommand(user.userId));
  }

  @Post('my-current/answers')
  @HttpCode(200)
  async sendAnswer(
    @User() user: TokenPayload,
    @Body() data: AnswerInputModel,
  ): Promise<AnswerInfo> {
    return this.commandBus.execute(
      new SendQuizAnswerCommand(user.userId, data),
    );
  }
}
