import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../../users/typeorm/models/user';

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

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  entityId: string;
}
