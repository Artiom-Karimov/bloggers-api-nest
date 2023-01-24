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
import { CommentCreateModel } from '../../usecases/commands/create.comment.command';
import IdGenerator from '../../../../../common/utils/id.generator';

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

  @ManyToOne(() => Post, (p) => p.comments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'postId' })
  post: Post;
  @Column({ type: 'uuid' })
  postId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => CommentLike, (l) => l.comment, { cascade: true })
  likes: CommentLike[];

  public static create(
    data: CommentCreateModel,
    post: Post,
    user: User,
  ): Comment {
    const comment = new Comment();
    comment.id = IdGenerator.generate();
    comment.content = data.content;
    comment.createdAt = new Date();
    comment.bannedByBlogger = false;
    comment.post = post;
    comment.user = user;
    return comment;
  }

  get userLogin(): string {
    if (!this.user) return null;
    return this.user.login;
  }

  public setContent(content: string, userId: string) {
    if (userId !== this.userId) throw new Error('illegal comment update');
    this.content = content;
  }
}
