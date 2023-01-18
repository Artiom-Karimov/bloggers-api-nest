import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import { GetCurrentGameQuery } from './usecases/queries/get.current.game.query';

@Controller('pair-game-quiz/pairs')
@UseGuards(BearerAuthGuard)
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get('my-current')
  async getCurrent(@User() user: TokenPayload) {
    return this.queryBus.execute(new GetCurrentGameQuery(user.userId));
  }
}
