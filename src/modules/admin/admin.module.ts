import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import AdminController from './admin.controller';
import { BanUserHandler } from './commands/handlers/ban.user.handler';

@Module({
  imports: [CqrsModule, BlogsModule, UsersModule, AuthModule],
  controllers: [AdminController],
  providers: [BanUserHandler],
})
export class AdminModule { }
