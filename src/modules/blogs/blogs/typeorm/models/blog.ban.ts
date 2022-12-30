import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './blog';

@Entity()
export class BlogBan {
  @PrimaryColumn('uuid')
  blogId: string;
  @OneToOne(() => Blog, (b) => b.ban, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column({ type: 'boolean', nullable: false })
  isBanned: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;

  public static create(isBanned: boolean, blog: Blog): BlogBan {
    const ban = new BlogBan();
    ban.isBanned = isBanned;
    ban.banDate = isBanned ? new Date() : null;
    ban.blog = blog;
    return ban;
  }

  public setStatus(isBanned: boolean) {
    if (this.isBanned === isBanned) return;
    this.isBanned = isBanned;
    this.banDate = isBanned ? new Date() : null;
  }
}
