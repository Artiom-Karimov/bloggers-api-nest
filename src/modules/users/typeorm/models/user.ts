import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBan } from './user.ban';
import { EmailConfirmation } from './email.confirmation';
import { Recovery } from './recovery';
import { Session } from './session';
import UserDto from '../../models/dto/user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', nullable: false })
  login: string;

  @Column({ type: 'character varying', nullable: false })
  email: string;

  @Column({ type: 'character varying', nullable: false })
  hash: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @OneToOne(() => EmailConfirmation, (ec) => ec.user)
  emailConfirmation: Promise<EmailConfirmation>;

  @OneToOne(() => Recovery, (rec) => rec.user)
  recovery: Promise<Recovery>;

  @OneToOne(() => UserBan, (ban) => ban.user)
  ban: Promise<UserBan>;

  @OneToMany(() => Session, (s) => s.user)
  sessions: Promise<Session[]>;

  constructor(dto: UserDto) {
    this.id = dto.id;
    this.login = dto.login;
    this.email = dto.email;
    this.hash = dto.passwordHash;
    this.createdAt = dto.createdAt;
  }
}
