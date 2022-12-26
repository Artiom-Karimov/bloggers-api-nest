import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';

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
}
