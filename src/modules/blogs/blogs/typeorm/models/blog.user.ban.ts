import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog';
import { User } from '../../../../users/typeorm/models/user';
import IdGenerator from '../../../../../common/utils/id.generator';

@Entity()
@Index(['userId', 'blogId'], { unique: true })
export class BlogUserBan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;
  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'boolean', nullable: false })
  isBanned: boolean;

  @Column({
    type: 'character varying',
    length: 1000,
    collation: 'C',
    nullable: true,
  })
  banReason: string;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;

  public static create(banReason: string, blog: Blog, user: User): BlogUserBan {
    const ban = new BlogUserBan();
    ban.id = IdGenerator.generate();
    ban.blog = blog;
    ban.user = user;
    ban.isBanned = true;
    ban.banReason = banReason;
    ban.banDate = new Date();
    return ban;
  }

  get userLogin(): string {
    return this.user.login;
  }
}
