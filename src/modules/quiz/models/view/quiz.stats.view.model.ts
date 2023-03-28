import { ApiProperty } from '@nestjs/swagger';
import { QuizStats } from '../domain/quiz.stats';

export class QuizStatsViewModel {
  @ApiProperty()
  sumScore: number;

  @ApiProperty()
  avgScores: number;

  @ApiProperty()
  gamesCount: number;

  @ApiProperty()
  winsCount: number;

  @ApiProperty()
  lossesCount: number;

  @ApiProperty()
  drawsCount: number;

  constructor(model: QuizStats) {
    this.sumScore = model.sumScore;
    this.gamesCount = model.gamesCount;
    this.winsCount = model.winsCount;
    this.lossesCount = model.lossesCount;
    this.drawsCount = model.drawsCount;
    this.avgScores = this.sumScore / this.gamesCount;
  }
}
