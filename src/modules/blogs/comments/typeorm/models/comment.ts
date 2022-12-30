import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../../posts/typeorm/models/post';
import { User } from '../../../../users/typeorm/models/user';
import { CommentLike } from '../../../likes/typeorm/models/comment.like';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 300,
    nullable: false,
    collation: 'C',
  })
  content: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: false })
  bannedByBlogger: boolean;

  @ManyToOne(() => Post, (p) => p.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CommentLike, (l) => l.comment)
  likes: Promise<CommentLike[]>;
}
