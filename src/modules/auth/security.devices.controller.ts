import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { AuthError } from './models/auth.error';
import SessionViewModel from './models/session/session.view.model';
import SessionsQueryRepository from './sessions.query.repository';
import SessionsService from './sessions.service';
import { Request } from 'express';

@Controller('security/devices')
export default class SecurityDevicesController {
  constructor(
    private readonly service: SessionsService,
    private readonly queryRepo: SessionsQueryRepository,
  ) { }

  @Get()
  @UseGuards(RefreshTokenGuard)
  async get(@Req() req: Request): Promise<SessionViewModel[]> {
    return this.queryRepo.get(req.user.userId);
  }

  @Delete()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteAllButOne(@Req() req: Request): Promise<void> {
    await this.service.deleteAllButOne(req.user.userId, req.user.deviceId);
    return;
  }

  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteOne(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
  ): Promise<void> {
    const result = await this.service.deleteOne(req.user.userId, deviceId);
    if (result === AuthError.NoError) return;
    if (result === AuthError.NotFound) throw new NotFoundException();
    if (result === AuthError.WrongCredentials) throw new ForbiddenException();
    throw new BadRequestException();
  }
}
