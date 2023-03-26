import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../users/typeorm/models/user';

@Entity()
export class QuizStats {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('integer')
  sumScore: number;

  @Column('integer')
  avgScores: number;

  @Column('integer')
  gamesCount: number;

  @Column('integer')
  winsCount: number;

  @Column('integer')
  lossesCount: number;

  @Column('integer')
  drawsCount: number;
}
