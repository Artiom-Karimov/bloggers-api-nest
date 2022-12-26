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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying' })
  login: string;

  @Column({ type: 'character varying' })
  email: string;

  @Column({ type: 'character varying' })
  hash: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(() => EmailConfirmation, (ec) => ec.user)
  emailConfirmation: EmailConfirmation;

  @OneToOne(() => Recovery, (rec) => rec.user)
  recovery?: Recovery;

  @OneToOne(() => UserBan, (ban) => ban.user)
  ban?: UserBan;

  @OneToMany(() => Session, (s) => s.user)
  sessions: Session[];
}
