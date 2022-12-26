import { Module } from '@nestjs/common';

import UsersRepository from './interfaces/users.repository';
import UsersQueryRepository from './interfaces/users.query.repository';

import UsersBanRepository from './interfaces/users.ban.repository';
import UsersBanQueryRepository from './interfaces/users.ban.query.repository';

import EmailConfirmationRepository from './interfaces/email.confirmation.repository';

import RecoveryRepository from './interfaces/recovery.repository';

import SessionsRepository from './interfaces/sessions.repository';
import SessionsQueryRepository from './interfaces/sessions.query.repository';
import SqlUsersRepository from './sql/sql.users.repository';
import SqlUsersQueryRepository from './sql/sql.users.query.repository';
import SqlSessionsRepository from './sql/sql.sessions.repository';
import SqlSessionsQueryRepository from './sql/sql.sessions.query.repository';
import SqlEmailConfirmationRepository from './sql/sql.email.confirmation.repository';
import SqlRecoveryRepository from './sql/sql.recovery.repository';
import SqlUsersBanRepository from './sql/sql.users.ban.repository';
import SqlUsersBanQueryRepository from './sql/sql.users.ban.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/models/user';
import { Session } from './typeorm/models/session';
import { UserBan } from './typeorm/models/user.ban';
import { EmailConfirmation } from './typeorm/models/email.confirmation';
import { Recovery } from './typeorm/models/recovery';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Session]),
    TypeOrmModule.forFeature([UserBan]),
    TypeOrmModule.forFeature([EmailConfirmation]),
    TypeOrmModule.forFeature([Recovery]),
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
      useClass: SqlUsersBanRepository,
    },
    {
      provide: UsersBanQueryRepository,
      useClass: SqlUsersBanQueryRepository,
    },
    {
      provide: EmailConfirmationRepository,
      useClass: SqlEmailConfirmationRepository,
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
      useClass: SqlRecoveryRepository,
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
