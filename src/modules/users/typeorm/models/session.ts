import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as config from '../../../../config/users';
import { User } from './user';
import IdGenerator from '../../../../common/utils/id.generator';
import TokenPair from '../../../auth/models/jwt/token.pair';
import { SessionCreateType } from '../../models/input/session.create.type';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  deviceId: string;

  @ManyToOne(() => User, (u) => u.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'character varying' })
  deviceName: string;

  @Column({ type: 'character varying' })
  ip: string;

  @Column({ type: 'timestamptz' })
  issuedAt: Date;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  constructor(data: SessionCreateType, user: User) {
    this.user = user;
    this.deviceId = IdGenerator.generate();
    this.deviceName = data.deviceName;
    this.issuedAt = new Date();
    this.expiresAt = new Date(Date.now() + config.refreshExpireMillis);
  }
  public refresh(ip: string, deviceName: string, userId: string): Session {
    if (userId !== this.userId) throw new Error('Wrong user id');
    if (!this.isValid) throw new Error('Session expired');

    this.ip = ip;
    this.deviceName = deviceName;
    this.issuedAt = new Date();
    this.expiresAt = new Date(Date.now() + config.refreshExpireMillis);
    return this;
  }

  get userId(): string {
    return this.user.id;
  }
  get userLogin(): string {
    return this.user.login;
  }
  get isValid(): boolean {
    return this.expiresAt > new Date();
  }

  public getTokens(): TokenPair {
    return new TokenPair({
      userId: this.userId,
      userLogin: this.userLogin,
      deviceId: this.deviceId,
      issuedAt: this.issuedAt.getTime(),
      exp: this.expiresAt.getTime(),
    });
  }
}
