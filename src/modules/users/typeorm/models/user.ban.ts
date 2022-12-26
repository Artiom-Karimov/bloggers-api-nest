import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class UserBan {
  @OneToOne(() => User, (u) => u.ban)
  @JoinColumn()
  user: User;
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'boolean' })
  isBanned: boolean;

  @Column({ type: 'character varying', nullable: true })
  banReason: string;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;
}
