import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import SessionViewModel from '../users/models/view/session.view.model';
import SessionsQueryRepository from '../users/interfaces/sessions.query.repository';
import TokenPayload from './models/jwt/token.payload';
import { User } from './guards/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import LogoutAnotherSessionsCommand from './usecases/commands/logout.another.sessions.command';
import DeleteSessionCommand from './usecases/commands/delete.session.command';
import IdParams from '../../common/models/id.param';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger/dist';

@Controller('security/devices')
@UseGuards(RefreshTokenGuard)
@ApiTags('Security devices')
@ApiCookieAuth()
export default class SecurityDevicesController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryRepo: SessionsQueryRepository,
  ) { }

  @Get()
  async get(@User() user: TokenPayload): Promise<SessionViewModel[]> {
    return this.queryRepo.get(user.userId);
  }

  @Delete()
  @HttpCode(204)
  async deleteAllButOne(@User() user: TokenPayload): Promise<void> {
    return this.commandBus.execute(
      new LogoutAnotherSessionsCommand(user.userId, user.deviceId),
    );
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async deleteOne(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteSessionCommand(user.userId, params.deviceId),
    );
  }
}
