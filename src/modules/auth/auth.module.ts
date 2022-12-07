import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthController from './auth.controller';
import { DdosGuard } from './guards/ddos.guard';
import Recovery, { RecoverySchema } from './models/recovery/recovery.schema';
import RecoveryRepository from './recovery.repository';
import SessionsQueryRepository from '../users/mongoose/mongo.sessions.query.repository';
import SessionsRepository from '../users/mongoose/mongo.sessions.repository';
import SessionsService from './sessions.service';
import SecurityDevicesController from './security.devices.controller';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import RegisterHandler from './commands/handlers/register.handler';
import { CqrsModule } from '@nestjs/cqrs';
import EmailResendHandler from './commands/handlers/email.resend.handler';
import EmailConfirmHandler from './commands/handlers/email.confirm.handler';
import RecoverPasswordHandler from './commands/handlers/recover.password.handler';
import SetNewPasswordPasswordHandler from './commands/handlers/set.new.password.handler';
import LoginHandler from './commands/handlers/login.handler';
import RefreshTokenHandler from './commands/handlers/refresh.token.handler';
import LogoutHandler from './commands/handlers/logout.handler';
import LogoutAnotherSessionsHandler from './commands/handlers/logout.another.sessions.handler';
import DeleteSessionHandler from './commands/handlers/delete.session.handler';
import CheckUserBanHandler from './queries/handlers/check.user.ban.handler';

const commandHandlers = [
  RegisterHandler,
  EmailResendHandler,
  EmailConfirmHandler,
  RecoverPasswordHandler,
  SetNewPasswordPasswordHandler,
  LoginHandler,
  RefreshTokenHandler,
  LogoutHandler,
  LogoutAnotherSessionsHandler,
  DeleteSessionHandler,
];
const queryHandlers = [CheckUserBanHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController, SecurityDevicesController],
  providers: [
    DdosGuard,
    RecoveryRepository,
    SessionsService,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class AuthModule { }
