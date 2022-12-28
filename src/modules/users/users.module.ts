import { Module } from '@nestjs/common';

import UsersRepository from './interfaces/users.repository';
import UsersQueryRepository from './interfaces/users.query.repository';

import UsersBanRepository from './interfaces/users.ban.repository';
import UsersBanQueryRepository from './interfaces/users.ban.query.repository';

import EmailConfirmationRepository from './interfaces/email.confirmation.repository';

import RecoveryRepository from './interfaces/recovery.repository';

import SessionsRepository from './interfaces/sessions.repository';
import SessionsQueryRepository from './interfaces/sessions.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/models/user';
import { Session } from './typeorm/models/session';
import { UserBan } from './typeorm/models/user.ban';
import { EmailConfirmation } from './typeorm/models/email.confirmation';
import { Recovery } from './typeorm/models/recovery';
import { OrmUsersRepository } from './typeorm/orm.users.repository';
import { OrmUsersQueryRepository } from './typeorm/orm.users.query.repository';
import { OrmUsersBanRepository } from './typeorm/orm.users.ban.repository';
import { OrmUsersBanQueryRepository } from './typeorm/orm.users.ban.query.repository';
import { OrmEmailConfirmationRepository } from './typeorm/orm.email.confirmation.repository';
import { OrmSessionsRepository } from './typeorm/orm.sessions.repository';
import { OrmSessionsQueryRepository } from './typeorm/orm.sessions.query.repository';
import { OrmRecoveryRepository } from './typeorm/orm.recovery.repository';

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
      useClass: OrmUsersRepository,
    },
    {
      provide: UsersQueryRepository,
      useClass: OrmUsersQueryRepository,
    },
    {
      provide: UsersBanRepository,
      useClass: OrmUsersBanRepository,
    },
    {
      provide: UsersBanQueryRepository,
      useClass: OrmUsersBanQueryRepository,
    },
    {
      provide: EmailConfirmationRepository,
      useClass: OrmEmailConfirmationRepository,
    },
    {
      provide: SessionsRepository,
      useClass: OrmSessionsRepository,
    },
    {
      provide: SessionsQueryRepository,
      useClass: OrmSessionsQueryRepository,
    },
    {
      provide: RecoveryRepository,
      useClass: OrmRecoveryRepository,
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
