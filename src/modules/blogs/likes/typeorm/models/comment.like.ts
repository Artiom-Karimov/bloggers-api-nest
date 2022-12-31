import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../../users/typeorm/models/user';
import { Comment } from '../../../comments/typeorm/models/comment';

@Entity()
@Index(['userId', 'commentId'], { unique: true })
export class CommentLike {
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

  @ManyToOne(() => Comment, (c) => c.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
  @Column({ type: 'uuid' })
  commentId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'uuid' })
  userId: string;
}
