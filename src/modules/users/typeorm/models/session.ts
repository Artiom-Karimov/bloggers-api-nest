import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  deviceId: string;

  @ManyToOne(() => User, (u) => u.sessions)
  user: User;
  @Column()
  userId: string;

  @Column({ type: 'character varying' })
  deviceName: string;

  @Column({ type: 'character varying' })
  ip: string;

  @Column({ type: 'timestamptz' })
  issuedAt: Date;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
