import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Comment } from '../../../comments/typeorm/models/comment';
import { Like } from './like';
import LikeCreateModel from '../../models/like.create.model';
import { User } from '../../../../users/typeorm/models/user';

@Entity()
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (c) => c.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  comment: Comment;

  public static create(
    data: LikeCreateModel,
    user: User,
    comment: Comment,
  ): CommentLike {
    const like = new CommentLike();
    like.status = data.likeStatus;
    like.lastModified = new Date();
    like.user = user;
    like.comment = comment;
    return like;
  }
}
