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
import UserInputModel from '../users/models/input/user.input.model';
import { DdosGuard } from './guards/ddos.guard';
import CodeInputModel from './models/input/code.input.model';
import EmailInputModel from './models/input/email.input.model';
import LoginInputModel from './models/input/login.input.model';
import NewPasswordInputModel from './models/input/new.password.input.model';
import { throwValidationException } from '../../common/utils/validation.options';
import { Request, Response } from 'express';
import TokenPair from './models/jwt/token.pair';
import SessionUserViewModel from '../users/models/view/session.user.view.model';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { BearerAuthGuard } from './guards/bearer.auth.guard';
import { UserError } from '../users/models/user.error';
import { CommandBus } from '@nestjs/cqrs';
import RegisterCommand from './commands/commands/register.command';
import EmailResendCommand from './commands/commands/email.resend.command';
import EmailConfirmCommand from './commands/commands/email.confirm.command';
import RecoverPasswordCommand from './commands/commands/recover.password.command';
import SetNewPasswordCommand from './commands/commands/set.new.password.command';
import LoginCommand from './commands/commands/login.command';
import RefreshTokenCommand from './commands/commands/refresh.token.command';
import LogoutCommand from './commands/commands/logout.command';
import UsersQueryRepository from '../users/interfaces/users.query.repository';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersRepo: UsersQueryRepository,
  ) { }

  @Post('registration')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async register(@Body() data: UserInputModel): Promise<void> {
    const result = await this.commandBus.execute(new RegisterCommand(data));

    if (result === UserError.NoError) return;
    if (result === UserError.LoginExists)
      throwValidationException('login', 'login already exists');
    if (result === UserError.EmailExists)
      throwValidationException('email', 'email already exists');
    throw new BadRequestException();
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async resendEmail(@Body() data: EmailInputModel): Promise<void> {
    const result = await this.commandBus.execute(
      new EmailResendCommand(data.email),
    );

    if (result === UserError.NoError) return;
    throwValidationException('email', 'email is wrong or already confirmed');
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async confirmEmail(@Body() data: CodeInputModel): Promise<void> {
    const result = await this.commandBus.execute(
      new EmailConfirmCommand(data.code),
    );

    if (result === UserError.NoError) return;
    throwValidationException('code', 'wrong or already confirmed code');
  }

  @Post('password-recovery')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async recover(@Body() data: EmailInputModel): Promise<void> {
    await this.commandBus.execute(new RecoverPasswordCommand(data.email));
    return;
  }

  @Post('new-password')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async changePassword(@Body() data: NewPasswordInputModel): Promise<void> {
    const result = await this.commandBus.execute(
      new SetNewPasswordCommand(data),
    );
    if (result === UserError.NoError) return;
    throwValidationException('recoveryCode', 'wrong or outdated code');
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(DdosGuard)
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

    if (result instanceof TokenPair) {
      this.setCookie(res, result.refreshToken);
      res.status(200).send({ accessToken: result.accessToken });
      return;
    }
    throw new UnauthorizedException();
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(DdosGuard, RefreshTokenGuard)
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const result = await this.commandBus.execute(
      new RefreshTokenCommand({
        token: req.refreshToken,
        ip: req.ip || '<unknown>',
        deviceName: req.headers['user-agent'] || '<unknown>',
      }),
    );
    if (result instanceof TokenPair) {
      this.setCookie(res, result.refreshToken);
      res.status(200).send({ accessToken: result.accessToken });
      return;
    }
    throw new UnauthorizedException();
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: Request): Promise<void> {
    const result = await this.commandBus.execute(
      new LogoutCommand(req.refreshToken),
    );

    if (result === UserError.NoError) return;
    throw new UnauthorizedException();
  }

  @Get('me')
  @UseGuards(BearerAuthGuard)
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
