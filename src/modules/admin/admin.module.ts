import { Module } from '@nestjs/common';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import AdminController from './admin.controller';

@Module({
  imports: [BlogsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule { }
