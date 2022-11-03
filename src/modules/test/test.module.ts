import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Blog, { BlogSchema } from '../blogs/models/blog.schema';
import Post, { PostSchema } from '../posts/models/post.schema';
import TestController from './test.controller';
import TestRepository from './test.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [TestController],
  providers: [TestRepository],
})
export class TestModule { }
