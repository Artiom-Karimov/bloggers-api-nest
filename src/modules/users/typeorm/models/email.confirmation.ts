import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { EmailConfirmationDto } from '../../models/dto/email.confirmation.dto';

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

  constructor(data: EmailConfirmationDto) {
    this.userId = data.userId;
    this.confirmed = data.confirmed;
    this.code = data.code;
    this.expiration = data.expiration;
  }
}
