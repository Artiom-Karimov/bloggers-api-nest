import {
  BadRequestException,
  Body,
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
import TokenPayload from './models/jwt/token.payload';
import SessionViewModel from './models/session/session.view.model';
import SessionsQueryRepository from './sessions.query.repository';
import SessionsService from './sessions.service';

@Controller('security/devices')
export default class SecurityDevicesController {
  constructor(
    private readonly service: SessionsService,
    private readonly queryRepo: SessionsQueryRepository,
  ) { }

  @Get()
  @UseGuards(RefreshTokenGuard)
  async get(
    @Body('tokenPayload') payload: TokenPayload,
  ): Promise<SessionViewModel[]> {
    return this.queryRepo.get(payload.userId);
  }

  @Delete()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteAllButOne(
    @Body('tokenPayload') payload: TokenPayload,
  ): Promise<void> {
    await this.service.deleteAllButOne(payload.userId, payload.deviceId);
    return;
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteOne(
    @Param('deviceId') deviceId: string,
    @Body('tokenPayload') payload: TokenPayload,
  ): Promise<void> {
    const result = await this.service.deleteOne(payload.userId, deviceId);
    if (result === AuthError.NoError) return;
    if (result === AuthError.NotFound) throw new NotFoundException();
    if (result === AuthError.WrongCredentials) throw new ForbiddenException();
    throw new BadRequestException();
  }
}
