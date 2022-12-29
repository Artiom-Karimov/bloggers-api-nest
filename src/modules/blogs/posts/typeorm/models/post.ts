import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../../blogs/typeorm/models/blog';
import { Comment } from '../../../comments/typeorm/models/comment';
import { PostLike } from '../../../likes/typeorm/models/post.like';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 30,
    nullable: false,
    collation: 'C',
  })
  title: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  shortDescription: string;

  @Column({
    type: 'character varying',
    length: 1000,
    nullable: false,
    collation: 'C',
  })
  content: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @ManyToOne(() => Blog, (b) => b.posts)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Promise<Comment[]>;

  @OneToMany(() => PostLike, (l) => l.post)
  likes: Promise<PostLike[]>;
}
