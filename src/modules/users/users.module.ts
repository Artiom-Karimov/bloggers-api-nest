import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserBan, { UserBanSchema } from './models/ban/user.ban.schema';
import User, { UserSchema } from './models/user.schema';
import UsersBanRepository from './users.ban.repository';
import UsersController from './users.controller';
import UsersQueryRepository from './users.query.repository';
import UsersRepository from './users.repository';
import UsersService from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserBan.name, schema: UserBanSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    UsersBanRepository,
  ],
})
export class UsersModule { }
