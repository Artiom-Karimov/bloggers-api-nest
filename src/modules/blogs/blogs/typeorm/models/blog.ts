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

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', nullable: false, collation: 'C' })
  name: string;

  @Column({ type: 'character varying', nullable: false, collation: 'C' })
  description: string;

  @Column({ type: 'character varying', nullable: false, collation: 'C' })
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
}
