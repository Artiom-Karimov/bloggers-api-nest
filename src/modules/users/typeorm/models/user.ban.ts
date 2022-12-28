import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { UserBanDto } from '../../models/dto/user.ban.dto';

@Entity()
export class UserBan {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;
  @OneToOne(() => User, (u) => u.ban)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', nullable: false })
  isBanned: boolean;

  @Column({ type: 'character varying', nullable: true })
  banReason: string;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;

  constructor(data: UserBanDto) {
    this.userId = data.userId;
    this.isBanned = data.isBanned;
    this.banReason = data.banReason;
    this.banDate = data.banDate;
  }
}
