import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog';
import { User } from '../../../../users/typeorm/models/user';

@Entity()
export class BlogUserBan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', nullable: false })
  isBanned: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  banReason: string;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;
}
