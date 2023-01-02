import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Comment } from '../../../comments/typeorm/models/comment';
import { Like } from './like';

@Entity()
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (c) => c.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  comment: Comment;
}
