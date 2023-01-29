import {
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
import UserInputModel from '../users/models/input/user.input.model';
import { DdosGuard } from './guards/ddos.guard';
import CodeInputModel from './models/input/code.input.model';
import EmailInputModel from './models/input/email.input.model';
import LoginInputModel from './models/input/login.input.model';
import NewPasswordInputModel from './models/input/new.password.input.model';
import { Request, Response } from 'express';
import SessionUserViewModel from '../users/models/view/session.user.view.model';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { BearerAuthGuard } from './guards/bearer.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import RegisterCommand from './usecases/commands/register.command';
import EmailResendCommand from './usecases/commands/email.resend.command';
import EmailConfirmCommand from './usecases/commands/email.confirm.command';
import RecoverPasswordCommand from './usecases/commands/recover.password.command';
import SetNewPasswordCommand from './usecases/commands/set.new.password.command';
import LoginCommand from './usecases/commands/login.command';
import RefreshTokenCommand from './usecases/commands/refresh.token.command';
import LogoutCommand from './usecases/commands/logout.command';
import UsersQueryRepository from '../users/interfaces/users.query.repository';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger/dist/decorators';
import { ApiCookieAuth } from '@nestjs/swagger/dist';
import { AccessTokenViewModel } from '../users/models/view/access.token.view.model';

@Controller('auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersRepo: UsersQueryRepository,
  ) { }

  @Post('registration')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  @ApiOperation({
    summary: 'Register as new user. Confirmation email will be sent',
  })
  @ApiResponse({ status: 204, description: 'Success, email sent' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async register(@Body() data: UserInputModel): Promise<void> {
    return this.commandBus.execute(new RegisterCommand(data));
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  @ApiOperation({
    summary: 'Resend email for user to confirm his account',
  })
  @ApiResponse({ status: 204, description: 'Success, email sent' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async resendEmail(@Body() data: EmailInputModel): Promise<void> {
    return this.commandBus.execute(new EmailResendCommand(data.email));
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  @ApiOperation({
    summary: 'Confirm user account with code from email',
  })
  @ApiResponse({ status: 204, description: 'Success, account confirmed' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async confirmEmail(@Body() data: CodeInputModel): Promise<void> {
    return this.commandBus.execute(new EmailConfirmCommand(data.code));
  }

  @Post('password-recovery')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  @ApiOperation({
    summary: 'Send email for user to set new password',
  })
  @ApiResponse({
    status: 204,
    description: "Success, even if user doesn't exist",
  })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async recover(@Body() data: EmailInputModel): Promise<void> {
    return this.commandBus.execute(new RecoverPasswordCommand(data.email));
  }

  @Post('new-password')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  @ApiOperation({
    summary: 'Set new password with secret code from recovery email',
  })
  @ApiResponse({ status: 204, description: 'Success, password updated' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async changePassword(@Body() data: NewPasswordInputModel): Promise<void> {
    return this.commandBus.execute(new SetNewPasswordCommand(data));
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(DdosGuard)
  @ApiOperation({
    summary: 'Create user session with login or email',
  })
  @ApiResponse({
    status: 200,
    type: AccessTokenViewModel,
    description:
      'Success, JWT tokens generated. Refresh token is returned as "refreshToken" cookie',
  })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async login(
    @Body() data: LoginInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new LoginCommand({
        ...data,
        ip: req.ip || '<unknown>',
        deviceName: req.headers['user-agent'] || '<unknown>',
      }),
    );

    this.setCookie(res, result.refreshToken);
    res.status(200).send({ accessToken: result.accessToken });
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(DdosGuard, RefreshTokenGuard)
  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Generate new token pair' })
  @ApiResponse({
    status: 200,
    type: AccessTokenViewModel,
    description:
      'Success, JWT tokens generated. Refresh token is returned as "refreshToken" cookie',
  })
  @ApiResponse({ status: 401, description: 'Missing or expired refreshToken' })
  @ApiResponse({ status: 429, description: 'Too many requests from this ip' })
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const result = await this.commandBus.execute(
      new RefreshTokenCommand({
        token: req.refreshToken,
        ip: req.ip || '<unknown>',
        deviceName: req.headers['user-agent'] || '<unknown>',
      }),
    );

    this.setCookie(res, result.refreshToken);
    res.status(200).send({ accessToken: result.accessToken });
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Remove current session' })
  @ApiResponse({ status: 204, description: 'Success, session removed' })
  @ApiResponse({ status: 401, description: 'Missing or expired refreshToken' })
  async logout(@Req() req: Request): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(req.refreshToken));
  }

  @Get('me')
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'User info',
    type: SessionUserViewModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: Request): Promise<SessionUserViewModel> {
    const result = await this.usersRepo.getSessionUserView(req.user.userId);
    if (!result) throw new UnauthorizedException();
    return result;
  }

  private setCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
    });
  }
}
