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
import { AuthError } from './models/auth.error';
import SessionViewModel from './models/session/session.view.model';
import SessionsQueryRepository from './sessions.query.repository';
import SessionsService from './sessions.service';
import TokenPayload from './models/jwt/token.payload';
import { User } from './guards/user.decorator';

@Controller('security/devices')
export default class SecurityDevicesController {
  constructor(
    private readonly service: SessionsService,
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
    await this.service.deleteAllButOne(user.userId, user.deviceId);
    return;
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteOne(
    @Param('deviceId') deviceId: string,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.service.deleteOne(user.userId, deviceId);
    if (result === AuthError.NoError) return;
    if (result === AuthError.NotFound) throw new NotFoundException();
    if (result === AuthError.WrongCredentials) throw new ForbiddenException();
    throw new BadRequestException();
  }
}
