import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../../posts/typeorm/models/post';
import { User } from '../../../../users/typeorm/models/user';

@Entity()
@Index(['userId', 'postId'], { unique: true })
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 20,
    nullable: false,
    collation: 'C',
  })
  status: string;

  @Column({ type: 'timestamptz', nullable: false })
  lastModified: Date;

  @ManyToOne(() => Post, (p) => p.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
  @Column({ type: 'uuid' })
  postId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'uuid' })
  userId: string;
}
