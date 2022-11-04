import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from './models/user.schema';
import UsersController from './users.controller';
import UsersQueryRepository from './users.query.repository';
import UsersRepository from './users.repository';
import UsersService from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersQueryRepository, UsersService],
})
export class UsersModule { }
