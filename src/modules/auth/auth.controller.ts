import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import UserInputModel from '../users/models/user.input.model';
import UserViewModel from '../users/models/user.view.model';
import UsersQueryRepository from '../users/users.query.repository';
import AuthService from './auth.service';
import { DdosGuard } from './guards/ddos.guard';
import CodeInputModel from './models/input/code.input.model';
import EmailInputModel from './models/input/email.input.model';
import LoginInputModel from './models/input/login.input.model';
import NewPasswordInputModel from './models/input/new.password.input.model';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly queryRepo: UsersQueryRepository,
  ) { }

  @Post('registration')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async register(@Body() data: UserInputModel): Promise<void> {
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async resendEmail(@Body() data: EmailInputModel): Promise<void> {
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async confirmEmail(@Body() data: CodeInputModel): Promise<void> {
    return;
  }

  @Post('password-recovery')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async recover(@Body() data: EmailInputModel): Promise<void> {
    return;
  }

  @Post('new-password')
  @HttpCode(204)
  @UseGuards(DdosGuard)
  async changePassword(@Body() data: NewPasswordInputModel): Promise<void> {
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
