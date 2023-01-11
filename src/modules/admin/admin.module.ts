import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import AdminBlogsController from './admin.blogs.controller';
import AdminUsersController from './admin.users.controller';
import AdminQuizController from './admin.quiz.controller';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [CqrsModule, BlogsModule, UsersModule, AuthModule, QuizModule],
  controllers: [
    AdminBlogsController,
    AdminUsersController,
    AdminQuizController,
  ],
})
export class AdminModule { }
