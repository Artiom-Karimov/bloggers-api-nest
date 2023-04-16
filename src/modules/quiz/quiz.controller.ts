import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import { GetCurrentGameQuery } from './usecases/queries/get.current.game.query';
import { QuizViewModel } from './models/view/quiz.view.model';
import { GetGameQuery } from './usecases/queries/get.game.query';
import IdParams from '../../common/models/id.param';
import { ConnectToQuizCommand } from './usecases/commands/connect.to.quiz.command';
import { AnswerInputModel } from './models/input/answer.input.model';
import { SendQuizAnswerCommand } from './usecases/commands/send.quiz.answer.command';
import { HttpCode, Query } from '@nestjs/common/decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { AnswerInfo } from './models/view/player.progress';
import { QuizPage } from '../swagger/models/pages';
import { GetUserGamesQuery } from './usecases/queries/get.user.games.query';
import PageViewModel from '../../common/models/page.view.model';
import { GetGamesQueryParams } from './models/input/get.games.query.params';
import { QuizStatsViewModel } from './models/view/quiz.stats.view.model';
import { GetUserStatsQuery } from './usecases/queries/get.user.stats.query';

@Controller('pair-game-quiz/pairs')
@UseGuards(BearerAuthGuard)
@ApiTags('Quiz (for user)')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get('my')
  @ApiOperation({ summary: 'Get all games by current user' })
  @ApiQuery({ type: GetGamesQueryParams })
  @ApiResponse({ status: 200, description: 'Success', type: QuizPage })
  async getAll(
    @User() user: TokenPayload,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<QuizViewModel>> {
    const params = new GetGamesQueryParams(reqQuery);
    return this.queryBus.execute(new GetUserGamesQuery(user.userId, params));
  }

  @Get('my-statistic')
  @ApiOperation({ summary: 'Get current user sstatistics' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: QuizStatsViewModel,
  })
  async geetStats(@User() user: TokenPayload) {
    return this.queryBus.execute(new GetUserStatsQuery(user.userId));
  }

  @Get('my-current')
  @ApiOperation({ summary: 'Get current (not finished) game' })
  @ApiResponse({ status: 200, description: 'Success', type: QuizViewModel })
  @ApiResponse({ status: 404, description: 'User does not have current game' })
  async getCurrent(@User() user: TokenPayload): Promise<QuizViewModel> {
    return this.queryBus.execute(new GetCurrentGameQuery(user.userId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Success', type: QuizViewModel })
  @ApiResponse({
    status: 403,
    description: 'User did not participate in this game',
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async get(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<QuizViewModel> {
    return this.queryBus.execute(new GetGameQuery(params.id, user.userId));
  }

  @Post('connection')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create new game or connect to existing one' })
  @ApiResponse({ status: 200, description: 'Success', type: QuizViewModel })
  @ApiResponse({ status: 403, description: 'User already has current game' })
  async connect(@User() user: TokenPayload): Promise<QuizViewModel> {
    return this.commandBus.execute(new ConnectToQuizCommand(user.userId));
  }

  @Post('my-current/answers')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send an answer to the next question' })
  @ApiResponse({ status: 200, description: 'Success', type: AnswerInfo })
  @ApiResponse({
    status: 403,
    description: 'User already answered all questions or has no current game',
  })
  async sendAnswer(
    @User() user: TokenPayload,
    @Body() data: AnswerInputModel,
  ): Promise<AnswerInfo> {
    return this.commandBus.execute(
      new SendQuizAnswerCommand(user.userId, data),
    );
  }
}
