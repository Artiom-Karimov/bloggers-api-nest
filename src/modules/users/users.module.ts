import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Session, { SessionSchema } from '../auth/models/session/session.schema';
import SessionsRepository from '../auth/sessions.repository';
import EmailConfirmationRepository from './mongoose/mongo.email.confirmation.repository';
import UserBan, { UserBanSchema } from './mongoose/models/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationSchema,
} from './mongoose/models/email.confirmation.schema';
import User, { UserSchema } from './mongoose/models/user.schema';
import UsersBanRepository from './mongoose/mongo.users.ban.repository';
import UsersQueryRepository from './mongoose/mongo.users.query.repository';
import UsersBanQueryRepository from './mongoose/mongo.users.ban.query.repository';
import UsersRepository from './users.repository';
import MongoUsersRepository from './mongoose/mongo.users.repository';

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
    UsersQueryRepository,
    UsersBanRepository,
    EmailConfirmationRepository,
    SessionsRepository,
    UsersBanQueryRepository,
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
