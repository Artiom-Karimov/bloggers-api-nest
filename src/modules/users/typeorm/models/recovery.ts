import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { add } from 'date-fns';
import * as config from '../../../../config/users';
import { User } from './user';
import IdGenerator from '../../../../common/utils/id.generator';

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

  constructor(user: User) {
    this.user = user;
    this.code = IdGenerator.generate();
    this.expiration = add(new Date(), {
      minutes: config.recoveryExpireMinutes,
    });
  }

  get isExpired(): boolean {
    return this.expiration < new Date();
  }
}
