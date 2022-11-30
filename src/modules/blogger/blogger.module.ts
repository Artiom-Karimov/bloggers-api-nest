import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import BloggerController from './blogger.controller';
import BloggerUserController from './blogger.user.controller';

@Module({
  imports: [CqrsModule, BlogsModule, AuthModule],
  controllers: [BloggerController, BloggerUserController],
})
export class BloggerModule { }
