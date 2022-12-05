import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import SessionViewModel from './models/session/session.view.model';
import SessionsQueryRepository from './sessions.query.repository';
import TokenPayload from './models/jwt/token.payload';
import { User } from './guards/user.decorator';
import { UserError } from '../users/models/user.error';
import { CommandBus } from '@nestjs/cqrs';
import LogoutAnotherSessionsCommand from './commands/commands/logout.another.sessions.command';
import DeleteSessionCommand from './commands/commands/delete.session.command';

@Controller('security/devices')
export default class SecurityDevicesController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryRepo: SessionsQueryRepository,
  ) { }

  @Get()
  @UseGuards(RefreshTokenGuard)
  async get(@User() user: TokenPayload): Promise<SessionViewModel[]> {
    return this.queryRepo.get(user.userId);
  }

  @Delete()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteAllButOne(@User() user: TokenPayload): Promise<void> {
    await this.commandBus.execute(
      new LogoutAnotherSessionsCommand(user.userId, user.deviceId),
    );
    return;
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteOne(
    @Param('deviceId') deviceId: string,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new DeleteSessionCommand(user.userId, deviceId),
    );

    if (result === UserError.NoError) return;
    if (result === UserError.NotFound) throw new NotFoundException();
    if (result === UserError.WrongCredentials) throw new ForbiddenException();
    throw new BadRequestException();
  }
}
