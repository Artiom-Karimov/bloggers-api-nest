import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../../users/typeorm/models/user';
import { BlogBan } from './blog.ban';
import { BlogUserBan } from './blog.user.ban';
import { Post } from '../../../posts/typeorm/models/post';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 15,
    nullable: false,
    collation: 'C',
  })
  name: string;

  @Column({
    type: 'character varying',
    length: 500,
    nullable: false,
    collation: 'C',
  })
  description: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  websiteUrl: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.blogs)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToOne(() => BlogBan, (bb) => bb.blog)
  ban: BlogBan;

  @OneToMany(() => BlogUserBan, (bub) => bub.blog)
  bannedUsers: Promise<BlogUserBan[]>;

  @OneToMany(() => Post, (p) => p.blog)
  posts: Promise<Post[]>;
}
