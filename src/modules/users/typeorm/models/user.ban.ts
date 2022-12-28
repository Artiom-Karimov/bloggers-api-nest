import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { BanUserCreateModel } from '../../../admin/commands/commands/ban.user.command';

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

  constructor(data: BanUserCreateModel, user: User) {
    this.user = user;
    this.isBanned = data.isBanned ?? false;
    this.banReason = data.banReason ?? null;
    this.banDate = this.isBanned ? new Date() : null;
  }

  public setBan(data: BanUserCreateModel): UserBan {
    if (this.user.id !== data.userId) throw new Error('Wrong userId for ban');
    if (this.isBanned === data.isBanned) return this;
    if (data.isBanned) {
      this.isBanned = true;
      this.banReason = data.banReason;
      this.banDate = new Date();
    } else {
      this.isBanned = false;
      this.banReason = null;
      this.banDate = null;
    }
    return this;
  }
}
