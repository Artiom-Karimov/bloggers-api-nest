import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';
import BloggerController from './blogger.controller';

@Module({
  imports: [PostsModule, AuthModule],
  controllers: [BloggerController],
})
export class BloggerModule { }
