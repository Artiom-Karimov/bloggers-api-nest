import { Injectable } from '@nestjs/common';
import { Comment } from '../../comments/typeorm/models/comment';
import CommentViewModel from '../../comments/models/view/comment.view.model';

@Injectable()
export abstract class CommentLikesQueryRepository {
  abstract mergeWithLikes(comment: Comment): Promise<CommentViewModel>;
  abstract mergeManyWithLikes(comments: Comment[]): Promise<CommentViewModel[]>;
}
