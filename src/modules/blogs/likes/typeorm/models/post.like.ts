import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from '../../../posts/typeorm/models/post';
import { Like } from './like';

@Entity()
export class PostLike extends Like {
  @ManyToOne(() => Post, (p) => p.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  post: Post;
}
