import { ApiProperty } from '@nestjs/swagger';
import { QuizStats } from '../domain/quiz.stats';

export class QuizStatsViewModel {
  @ApiProperty()
  sumScore = 0;

  @ApiProperty()
  avgScores = 0;

  @ApiProperty()
  gamesCount = 0;

  @ApiProperty()
  winsCount = 0;

  @ApiProperty()
  lossesCount = 0;

  @ApiProperty()
  drawsCount = 0;

  constructor(model?: QuizStats) {
    if (!model) return;
    this.sumScore = model.sumScore;
    this.gamesCount = model.gamesCount;
    this.winsCount = model.winsCount;
    this.lossesCount = model.lossesCount;
    this.drawsCount = model.drawsCount;
    this.avgScores = this.sumScore / this.gamesCount;
  }
}
