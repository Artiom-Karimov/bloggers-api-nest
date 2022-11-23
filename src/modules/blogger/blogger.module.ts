import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import BloggerController from './blogger.controller';

@Module({
  imports: [BlogsModule, AuthModule],
  controllers: [BloggerController],
})
export class BloggerModule { }
