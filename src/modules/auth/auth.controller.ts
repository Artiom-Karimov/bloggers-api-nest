import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import UserInputModel from '../users/models/user.input.model';
import UserViewModel from '../users/models/user.view.model';
import AuthService from './auth.service';
import { DdosGuard } from './guards/ddos.guard';
import { AuthError } from './models/auth.error';
import CodeInputModel from './models/input/code.input.model';
import EmailInputModel from './models/input/email.input.model';
import LoginInputModel from './models/input/login.input.model';
import NewPasswordInputModel from './models/input/new.password.input.model';
import { throwValidationException } from '../../common/utils/validation.options';

@Controller('auth')
export default class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post('registration')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async register(@Body() data: UserInputModel): Promise<void> {
    const result = await this.service.register(data);

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
    const result = await this.service.resendEmail(data.email);

    if (result === AuthError.NoError) return;
    throwValidationException('email', 'email is wrong or already confirmed');
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async confirmEmail(@Body() data: CodeInputModel): Promise<void> {
    const result = await this.service.confirmEmail(data.code);
    if (!result)
      throwValidationException('code', 'wrong code or already confirmed');
    return;
  }

  @Post('password-recovery')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async recover(@Body() data: EmailInputModel): Promise<void> {
    await this.service.recoverPassword(data.email);
    return;
  }

  @Post('new-password')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async changePassword(@Body() data: NewPasswordInputModel): Promise<void> {
    const result = await this.service.setNewPassword(data);
    if (!result)
      throwValidationException('recoveryCode', 'wrong or outdated code');
    return;
  }

  @Post('login')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async login(@Body() data: LoginInputModel): Promise<void> {
    return;
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(DdosGuard)
  async refresh(): Promise<void> {
    return;
  }

  @Post('logout')
  @HttpCode(204)
  async logout(): Promise<void> {
    return;
  }

  @Get('me')
  async getMe(): Promise<UserViewModel> {
    return;
  }
}
