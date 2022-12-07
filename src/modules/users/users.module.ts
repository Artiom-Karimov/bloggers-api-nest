import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Session, { SessionSchema } from '../auth/models/session/session.schema';
import SessionsRepository from '../auth/sessions.repository';
import EmailConfirmationRepository from './email.confirmation.repository';
import UserBan, { UserBanSchema } from './mongoose/models/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationSchema,
} from './mongoose/models/email.confirmation.schema';
import User, { UserSchema } from './mongoose/models/user.schema';
import UsersBanRepository from './users.ban.repository';
import UsersQueryRepository from './users.query.repository';
import UsersBanQueryRepository from './users.ban.query.repository';
import UsersRepository from './users.repository';
import MongoUsersRepository from './mongoose/mongo.users.repository';
import MongoUsersQueryRepository from './mongoose/mongo.users.query.repository';
import MongoUsersBanRepository from './mongoose/mongo.users.ban.repository';
import MongoUsersBanQueryRepository from './mongoose/mongo.users.ban.query.repository';
import MongoEmailConfirmationRepository from './mongoose/mongo.email.confirmation.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  providers: [
    {
      provide: UsersRepository,
      useClass: MongoUsersRepository,
    },
    {
      provide: UsersQueryRepository,
      useClass: MongoUsersQueryRepository,
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
    SessionsRepository,
  ],
  exports: [
    UsersRepository,
    UsersBanRepository,
    UsersQueryRepository,
    UsersBanQueryRepository,
    EmailConfirmationRepository,
  ],
})
export class UsersModule { }
