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
import BlogInputModel from '../../models/input/blog.input.model';
import IdGenerator from '../../../../../common/utils/id.generator';

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

  @OneToOne(() => BlogBan, (bb) => bb.blog, { eager: true, cascade: true })
  ban: BlogBan;

  @OneToMany(() => BlogUserBan, (bub) => bub.blog)
  bannedUsers: Promise<BlogUserBan[]>;

  @OneToMany(() => Post, (p) => p.blog)
  posts: Promise<Post[]>;

  public static create(data: BlogInputModel, owner: User): Blog {
    const blog = new Blog();
    blog.id = IdGenerator.generate();
    blog.name = data.name;
    blog.description = data.description;
    blog.websiteUrl = data.websiteUrl;
    blog.createdAt = new Date();
    blog.owner = owner;
    blog.ban = BlogBan.create(false, blog);
    return blog;
  }
  get isBanned(): boolean {
    return this.ban.isBanned;
  }
  set isBanned(isBanned: boolean) {
    this.ban.setStatus(isBanned);
  }

  public updateData(data: BlogInputModel) {
    this.name = data.name;
    this.websiteUrl = data.websiteUrl;
    this.description = data.description;
  }
}
