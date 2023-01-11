import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import { BanUserHandler } from '../users/usecases/handlers/ban.user.handler';
import CreateConfirmedUserHandler from '../users/usecases/handlers/create.confirmed.user.handler';
import DeleteUserHandler from '../users/usecases/handlers/delete.user.handler';
import AdminBlogsController from './admin.blogs.controller';
import AdminUsersController from './admin.users.controller';

const commandHandlers = [
  BanUserHandler,
  CreateConfirmedUserHandler,
  DeleteUserHandler,
];

@Module({
  imports: [CqrsModule, BlogsModule, UsersModule, AuthModule],
  controllers: [AdminBlogsController, AdminUsersController],
  providers: [...commandHandlers],
})
export class AdminModule { }
