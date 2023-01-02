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
import IdGenerator from '../../../../../common/utils/id.generator';
import { PostCreateModel } from '../../commands/commands/create.post.command';
import { PostUpdateModel } from '../../commands/commands/update.post.command';
import { BlogError } from '../../../blogs/models/blog.error';
import LikeCreateModel from '../../../likes/models/like.create.model';
import { User } from '../../../../users/typeorm/models/user';

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

  @ManyToOne(() => Blog, (b) => b.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;
  @Column({ type: 'uuid' })
  blogId: string;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];

  @OneToMany(() => PostLike, (l) => l.post, { cascade: true })
  likes: PostLike[];

  public static create(data: PostCreateModel, blog: Blog): Post {
    const post = new Post();
    post.blog = blog;
    post.id = IdGenerator.generate();
    post.title = data.title;
    post.shortDescription = data.shortDescription;
    post.content = data.content;
    post.createdAt = new Date();
    return post;
  }

  get blogName(): string {
    return this.blog.name;
  }

  public updateData(data: PostUpdateModel): BlogError {
    if (data.postId !== this.id) return BlogError.Forbidden;
    if (data.blogId !== this.blogId) return BlogError.Forbidden;

    const { title, shortDescription, content } = data.data;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;

    return BlogError.NoError;
  }

  public putLike(data: LikeCreateModel, user: User) {
    if (!this.likes) this.likes = [];
    this.likes.push(PostLike.create(data, user, this));
  }
}
