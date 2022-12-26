import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class EmailConfirmation {
  @OneToOne(() => User, (u) => u.emailConfirmation)
  @JoinColumn()
  user: User;
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'boolean' })
  confirmed: boolean;

  @Column({ type: 'character varying', nullable: true })
  code: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiration: Date;
}
