import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { SessionDto } from '../../models/dto/session.dto';

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

  constructor(data: SessionDto) {
    this.ip = data.ip;
    this.deviceId = data.deviceId;
    this.deviceName = data.deviceName;
    this.userId = data.userId;
    this.issuedAt = data.issuedAt;
    this.expiresAt = data.expiresAt;
  }
}
