import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import AdminController from './admin.controller';
import { BanUserHandler } from './commands/handlers/ban.user.handler';
import CreateConfirmedUserHandler from './commands/handlers/create.confirmed.user.handler';
import DeleteUserHandler from './commands/handlers/delete.user.handler';

const commandHandlers = [
  BanUserHandler,
  CreateConfirmedUserHandler,
  DeleteUserHandler,
];

@Module({
  imports: [CqrsModule, BlogsModule, UsersModule, AuthModule],
  controllers: [AdminController],
  providers: [...commandHandlers],
})
export class AdminModule { }
