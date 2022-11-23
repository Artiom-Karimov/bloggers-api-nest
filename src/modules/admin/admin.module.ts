import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import AdminController from './admin.controller';

@Module({
  imports: [PostsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule { }
