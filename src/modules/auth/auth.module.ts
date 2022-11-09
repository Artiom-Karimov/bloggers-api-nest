import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserBan, { UserBanSchema } from '../users/models/ban/user.ban.schema';
import User, { UserSchema } from '../users/models/user.schema';
import UsersQueryRepository from '../users/users.query.repository';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { DdosGuard } from './guards/ddos.guard';
import Recovery, { RecoverySchema } from './models/recovery/recovery.schema';
import Session, { SessionSchema } from './models/session/session.schema';
import RecoveryRepository from './recovery.repository';
import SessionsQueryRepository from './sessions.query.repository';
import SessionsRepository from './sessions.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    DdosGuard,
    RecoveryRepository,
    SessionsRepository,
    SessionsQueryRepository,
    UsersQueryRepository,
    AuthService,
  ],
})
export class AuthModule { }
