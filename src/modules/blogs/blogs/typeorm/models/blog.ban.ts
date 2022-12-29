import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './blog';

@Entity()
export class BlogBan {
  @PrimaryColumn('uuid')
  blogId: string;
  @OneToOne(() => Blog, (b) => b.ban)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column({ type: 'boolean', nullable: false })
  isBanned: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;
}
