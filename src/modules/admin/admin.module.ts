import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import AdminController from './admin.controller';

@Module({
  imports: [CqrsModule, BlogsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule { }
