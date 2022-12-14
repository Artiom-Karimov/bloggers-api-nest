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
import UserInputModel from '../../models/input/user.input.model';
import Hasher from '../../../../common/utils/hasher';
import IdGenerator from '../../../../common/utils/id.generator';
import { Blog } from '../../../blogs/blogs/typeorm/models/blog';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 10,
    nullable: false,
    collation: 'C',
  })
  login: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: false,
    collation: 'C',
  })
  email: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: false,
    collation: 'C',
  })
  hash: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @OneToOne(() => EmailConfirmation, (ec) => ec.user)
  emailConfirmation: EmailConfirmation;

  @OneToOne(() => Recovery, (rec) => rec.user)
  recovery: Recovery;

  @OneToOne(() => UserBan, (b) => b.user, { eager: true })
  ban: UserBan;

  @OneToMany(() => Session, (s) => s.user)
  sessions: Promise<Session[]>;

  @OneToMany(() => Blog, (b) => b.owner)
  blogs: Promise<Blog[]>;

  public static async create(data: UserInputModel): Promise<User> {
    const user = new User();
    user.id = IdGenerator.generate();
    user.hash = await Hasher.hash(data.password);
    user.login = data.login;
    user.email = data.email;
    user.createdAt = new Date();

    return user;
  }

  get isBanned(): boolean {
    if (!this.ban) return false;
    return this.ban.isBanned;
  }

  public async checkPassword(password: string): Promise<boolean> {
    return Hasher.check(password, this.hash);
  }
  public async updatePassword(newPassword: string): Promise<User> {
    this.hash = await Hasher.hash(newPassword);
    return this;
  }
}
