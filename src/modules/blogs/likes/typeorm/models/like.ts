import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../../../users/typeorm/models/user';
import { BlogError } from '../../../blogs/models/blog.error';
import { LikeStatus } from '../../models/like.input.model';

@Entity()
@Index(['userId', 'entityId'], { unique: true })
export class Like {
  @Column({
    type: 'character varying',
    length: 20,
    nullable: false,
    collation: 'C',
  })
  status: string;

  @Column({ type: 'timestamptz', nullable: false })
  lastModified: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @PrimaryColumn({ type: 'uuid' })
  entityId: string;

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
