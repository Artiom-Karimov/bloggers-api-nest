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
    this.calcAverage();
  }

  private calcAverage(): void {
    if (this.gamesCount === 0) return;
    const avg = this.sumScore / this.gamesCount;
    if (avg % 1 === 0) {
      this.avgScores = Math.floor(avg);
    } else {
      const temp = avg.toFixed(2);
      this.avgScores = +temp;
    }
  }
}
