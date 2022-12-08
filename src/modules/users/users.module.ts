import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import User, { UserSchema } from './mongoose/models/user.schema';
import UsersRepository from './interfaces/users.repository';
import MongoUsersRepository from './mongoose/mongo.users.repository';
import UsersQueryRepository from './interfaces/users.query.repository';
import MongoUsersQueryRepository from './mongoose/mongo.users.query.repository';

import UserBan, { UserBanSchema } from './mongoose/models/user.ban.schema';
import UsersBanRepository from './interfaces/users.ban.repository';
import MongoUsersBanRepository from './mongoose/mongo.users.ban.repository';
import UsersBanQueryRepository from './interfaces/users.ban.query.repository';
import MongoUsersBanQueryRepository from './mongoose/mongo.users.ban.query.repository';

import EmailConfirmation, {
  EmailConfirmationSchema,
} from './mongoose/models/email.confirmation.schema';
import EmailConfirmationRepository from './interfaces/email.confirmation.repository';
import MongoEmailConfirmationRepository from './mongoose/mongo.email.confirmation.repository';

import Recovery, { RecoverySchema } from './mongoose/models/recovery.schema';
import RecoveryRepository from './interfaces/recovery.repository';
import MongoRecoveryRepository from './mongoose/mongo.recovery.repository';

import Session, { SessionSchema } from './mongoose/models/session.schema';
import SessionsRepository from './interfaces/sessions.repository';
import MongoSessionsRepository from './mongoose/mongo.sessions.repository';
import SessionsQueryRepository from './interfaces/sessions.query.repository';
import MongoSessionsQueryRepository from './mongoose/mongo.sessions.query.repository';
import SqlUsersRepository from './sql/sql.users.repository';
import SqlUsersQueryRepository from './sql/sql.users.query.repository';
import SqlSessionsRepository from './sql/sql.sessions.repository';
import SqlSessionsQueryRepository from './sql/sql.sessions.query.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  providers: [
    {
      provide: UsersRepository,
      useClass: SqlUsersRepository,
    },
    {
      provide: UsersQueryRepository,
      useClass: SqlUsersQueryRepository,
    },
    {
      provide: UsersBanRepository,
      useClass: MongoUsersBanRepository,
    },
    {
      provide: UsersBanQueryRepository,
      useClass: MongoUsersBanQueryRepository,
    },
    {
      provide: EmailConfirmationRepository,
      useClass: MongoEmailConfirmationRepository,
    },
    {
      provide: SessionsRepository,
      useClass: SqlSessionsRepository,
    },
    {
      provide: SessionsQueryRepository,
      useClass: SqlSessionsQueryRepository,
    },
    {
      provide: RecoveryRepository,
      useClass: MongoRecoveryRepository,
    },
  ],
  exports: [
    UsersRepository,
    UsersBanRepository,
    UsersQueryRepository,
    UsersBanQueryRepository,
    EmailConfirmationRepository,
    SessionsRepository,
    SessionsQueryRepository,
    RecoveryRepository,
  ],
})
export class UsersModule { }
