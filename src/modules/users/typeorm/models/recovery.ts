import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { RecoveryDto } from '../../models/dto/recovery.dto';

@Entity()
export class Recovery {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;
  @OneToOne(() => User, (u) => u.recovery)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'character varying', nullable: true })
  code: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiration: Date;

  constructor(data: RecoveryDto, user: User) {
    this.user = user;
    this.code = data.code;
    this.expiration = data.expiration;
  }
}
