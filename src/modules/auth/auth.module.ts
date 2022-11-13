import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import EmailConfirmationRepository from '../users/email.confirmation.repository';
import UserBan, { UserBanSchema } from '../users/models/ban/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationSchema,
} from '../users/models/email/email.confirmation.schema';
import User, { UserSchema } from '../users/models/user.schema';
import UsersBanRepository from '../users/users.ban.repository';
import UsersQueryRepository from '../users/users.query.repository';
import UsersRepository from '../users/users.repository';
import UsersService from '../users/users.service';
import AuthController from './auth.controller';
import { DdosGuard } from './guards/ddos.guard';
import Recovery, { RecoverySchema } from './models/recovery/recovery.schema';
import Session, { SessionSchema } from './models/session/session.schema';
import RecoveryRepository from './recovery.repository';
import SessionsQueryRepository from './sessions.query.repository';
import SessionsRepository from './sessions.repository';
import SessionsService from './sessions.service';
import RegistrationService from './registration.service';
import SecurityDevicesController from './security.devices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
  ],
  controllers: [AuthController, SecurityDevicesController],
  providers: [
    DdosGuard,
    RecoveryRepository,
    SessionsRepository,
    SessionsQueryRepository,
    UsersBanRepository,
    EmailConfirmationRepository,
    UsersRepository,
    UsersQueryRepository,
    RegistrationService,
    UsersService,
    SessionsService,
  ],
})
export class AuthModule { }
