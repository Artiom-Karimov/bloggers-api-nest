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

  @Column({ type: 'character varying', nullable: true, collation: 'C' })
  code: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiration: Date;

  public static create(user: User, confirmed = false): EmailConfirmation {
    const ec = new EmailConfirmation();

    ec.user = user;
    ec.confirmed = confirmed;
    if (confirmed) {
      ec.code = null;
      ec.expiration = null;
    } else {
      ec.code = IdGenerator.generate();
      ec.expiration = add(new Date(), {
        minutes: config.confirmationMinutes,
      } as Duration);
    }

    return ec;
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
