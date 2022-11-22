import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Session, { SessionSchema } from '../auth/models/session/session.schema';
import SessionsRepository from '../auth/sessions.repository';
import { PostsModule } from '../posts/posts.module';
import EmailConfirmationRepository from './email.confirmation.repository';
import UserBan, { UserBanSchema } from './models/ban/user.ban.schema';
import EmailConfirmation, {
  EmailConfirmationSchema,
} from './models/email/email.confirmation.schema';
import User, { UserSchema } from './models/user.schema';
import UsersBanRepository from './users.ban.repository';
import UsersQueryRepository from './users.query.repository';
import UsersRepository from './users.repository';
import UsersService from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    PostsModule,
  ],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    UsersBanRepository,
    EmailConfirmationRepository,
    SessionsRepository,
  ],
  exports: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    UsersBanRepository,
    EmailConfirmationRepository,
  ],
})
export class UsersModule { }
