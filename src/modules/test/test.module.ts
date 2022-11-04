import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Blog, { BlogSchema } from '../blogs/models/blog.schema';
import Comment, { CommentSchema } from '../comments/models/comment.schema';
import Post, { PostSchema } from '../posts/models/post.schema';
import User, { UserSchema } from '../users/models/user.schema';
import TestController from './test.controller';
import TestRepository from './test.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [TestController],
  providers: [TestRepository],
})
export class TestModule { }
