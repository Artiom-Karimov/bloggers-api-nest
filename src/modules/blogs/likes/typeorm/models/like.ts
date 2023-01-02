import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../../users/typeorm/models/user';
import LikeCreateModel from '../../models/like.create.model';
import IdGenerator from '../../../../../common/utils/id.generator';
import { BlogError } from '../../../blogs/models/blog.error';
import { LikeStatus } from '../../models/like.input.model';

@Entity()
@Index(['userId', 'entityId'], { unique: true })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 20,
    nullable: false,
    collation: 'C',
  })
  status: string;

  @Column({ type: 'timestamptz', nullable: false })
  lastModified: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  entityId: string;

  public static create(data: LikeCreateModel, user: User): Like {
    const like = new Like();
    like.id = IdGenerator.generate();
    like.entityId = data.entityId;
    like.status = data.likeStatus;
    like.lastModified = new Date();
    like.user = user;
    return like;
  }

  get userLogin(): string {
    if (!this.user) return null;
    return this.user.login;
  }

  public updateData(status: LikeStatus, userId: string): BlogError {
    if (this.userId !== userId) return BlogError.Forbidden;
    this.status = status;
    this.lastModified = new Date();
    return BlogError.NoError;
  }
}
