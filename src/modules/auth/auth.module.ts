import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthController from './auth.controller';
import { DdosGuard } from './guards/ddos.guard';
import Recovery, { RecoverySchema } from './models/recovery/recovery.schema';
import Session, { SessionSchema } from './models/session/session.schema';
import RecoveryRepository from './recovery.repository';
import SessionsQueryRepository from './sessions.query.repository';
import SessionsRepository from './sessions.repository';
import SessionsService from './sessions.service';
import SecurityDevicesController from './security.devices.controller';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import UserBan, { UserBanSchema } from '../users/models/ban/user.ban.schema';
import UsersBanQueryRepository from './users.ban.query.repository';
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

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController, SecurityDevicesController],
  providers: [
    DdosGuard,
    RecoveryRepository,
    SessionsRepository,
    SessionsQueryRepository,
    SessionsService,
    UsersBanQueryRepository,
    ...commandHandlers,
  ],
  exports: [UsersBanQueryRepository, SessionsRepository],
})
export class AuthModule { }
