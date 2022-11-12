import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import UserInputModel from '../users/models/user.input.model';
import { DdosGuard } from './guards/ddos.guard';
import { AuthError } from './models/auth.error';
import CodeInputModel from './models/input/code.input.model';
import EmailInputModel from './models/input/email.input.model';
import LoginInputModel from './models/input/login.input.model';
import NewPasswordInputModel from './models/input/new.password.input.model';
import { throwValidationException } from '../../common/utils/validation.options';
import { Request, Response } from 'express';
import TokenPair from './models/jwt/token.pair';
import RefreshTokenInputModel from './models/input/refresh.token.input.model';
import RegistrationService from './registration.service';
import SessionsService from './sessions.service';
import SessionUserViewModel from './models/session.user.view.model';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly regService: RegistrationService,
    private readonly sessionsService: SessionsService,
  ) { }

  @Post('registration')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async register(@Body() data: UserInputModel): Promise<void> {
    const result = await this.regService.register(data);

    switch (result) {
      case AuthError.NoError:
        return;
      case AuthError.LoginExists:
        throwValidationException('login', 'login already exists');
      case AuthError.EmailExists:
        throwValidationException('email', 'email already exists');
      default:
        throw new BadRequestException();
    }
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async resendEmail(@Body() data: EmailInputModel): Promise<void> {
    const result = await this.regService.resendEmail(data.email);

    if (result === AuthError.NoError) return;
    throwValidationException('email', 'email is wrong or already confirmed');
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async confirmEmail(@Body() data: CodeInputModel): Promise<void> {
    const result = await this.regService.confirmEmail(data.code);
    if (!result)
      throwValidationException('code', 'wrong code or already confirmed');
    return;
  }

  @Post('password-recovery')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async recover(@Body() data: EmailInputModel): Promise<void> {
    await this.regService.recoverPassword(data.email);
    return;
  }

  @Post('new-password')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async changePassword(@Body() data: NewPasswordInputModel): Promise<void> {
    const result = await this.regService.setNewPassword(data);
    if (!result)
      throwValidationException('recoveryCode', 'wrong or outdated code');
    return;
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(DdosGuard)
  async login(
    @Body() data: LoginInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<{ accessToken: string }> {
    data.ip = req.ip || '<unknown>';
    data.deviceName = req.headers['user-agent'] || '<unknown>';

    const result = await this.sessionsService.login(data);
    if (result instanceof TokenPair) return this.sendBackTokens(res, result);
    throw new UnauthorizedException();
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(DdosGuard)
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<{ accessToken: string }> {
    if (!req.cookies['refreshToken']) throw new UnauthorizedException();

    const data: RefreshTokenInputModel = {
      token: req.cookies.refreshToken,
      ip: req.ip || '<unknown>',
      deviceName: req.headers['user-agent'] || '<unknown>',
    };

    const result = await this.sessionsService.refreshToken(data);
    if (result instanceof TokenPair) return this.sendBackTokens(res, result);
    throw new UnauthorizedException();
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request): Promise<void> {
    if (!req.cookies['refreshToken']) throw new UnauthorizedException();

    const result = this.sessionsService.logout(req.cookies['refreshToken']);
    if (!result) throw new UnauthorizedException();
    return;
  }

  @Get('me')
  async getMe(@Req() req: Request): Promise<SessionUserViewModel> {
    if (!req.cookies['refreshToken']) throw new UnauthorizedException();
    const result = await this.sessionsService.getSessionUserView(
      req.cookies['refreshToken'],
    );
    if (!result) throw new UnauthorizedException();
    return result;
  }

  private sendBackTokens(
    res: Response,
    data: TokenPair,
  ): { accessToken: string } {
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
    });
    return { accessToken: data.accessToken };
  }
}
