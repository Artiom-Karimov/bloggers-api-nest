import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentsQueryRepository from './comments.query.repository';
import CommentsRepository from './comments.repository';
import Comment, { CommentSchema } from './models/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [],
  providers: [CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule { }
