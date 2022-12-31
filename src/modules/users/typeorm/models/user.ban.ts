import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { BanUserCreateModel } from '../../../admin/commands/commands/ban.user.command';

@Entity()
export class UserBan {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;
  @OneToOne(() => User, (u) => u.ban, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', nullable: false })
  isBanned: boolean;

  @Column({
    type: 'character varying',
    length: 1000,
    nullable: true,
    collation: 'C',
  })
  banReason: string;

  @Column({ type: 'timestamptz', nullable: true })
  banDate: Date;

  public static create(data: BanUserCreateModel, user: User): UserBan {
    const ban = new UserBan();

    ban.user = user;
    ban.isBanned = data.isBanned;
    ban.banReason = data.banReason ?? null;
    ban.banDate = ban.isBanned ? new Date() : null;

    return ban;
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
