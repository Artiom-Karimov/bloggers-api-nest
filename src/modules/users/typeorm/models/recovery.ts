import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { RecoveryDto } from '../../models/dto/recovery.dto';

@Entity()
export class Recovery {
  @OneToOne(() => User, (u) => u.recovery)
  @JoinColumn()
  user: User;
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'character varying', nullable: true })
  code: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiration: Date;

  constructor(data: RecoveryDto) {
    this.userId = data.userId;
    this.code = data.code;
    this.expiration = data.expiration;
  }
}
