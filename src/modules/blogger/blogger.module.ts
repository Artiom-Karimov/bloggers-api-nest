import { Module } from '@nestjs/common';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import BloggerController from './blogger.controller';

@Module({
  imports: [BlogsModule, PostsModule],
  controllers: [BloggerController],
})
export class BloggerModule { }
