import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { add } from 'date-fns';
import * as config from '../../../../config/users';
import { User } from './user';
import IdGenerator from '../../../../common/utils/id.generator';

@Entity()
export class EmailConfirmation {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;
  @OneToOne(() => User, (u) => u.emailConfirmation)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', nullable: false })
  confirmed: boolean;

  @Column({ type: 'character varying', nullable: true })
  code: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiration: Date;

  constructor(user: User, confirmed = false) {
    this.user = user;
    this.confirmed = confirmed;
    if (confirmed) {
      this.code = null;
      this.expiration = null;
    } else {
      this.code = IdGenerator.generate();
      this.expiration = add(new Date(), {
        minutes: config.confirmationMinutes,
      } as Duration);
    }
  }

  public confirm(): EmailConfirmation {
    if (this.isConfirmed) throw new Error('Email already confirmed');
    if (this.isExpired) throw new Error('Confirmation code expired');
    this.confirmed = true;
    this.expiration = null;

    return this;
  }

  get isExpired(): boolean {
    return this.expiration < new Date();
  }
  get isConfirmed(): boolean {
    return this.confirmed;
  }
  get confirmationCode(): string {
    return this.code;
  }
}
