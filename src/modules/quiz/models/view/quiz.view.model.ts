import { ApiProperty } from '@nestjs/swagger';
import { PlayerProgress } from './player.progress';
import { QuizStatus } from '../domain/quiz.status';

export class QuestionInfo {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public body: string;

  constructor(id: string, body: string) {
    this.id = id;
    this.body = body;
  }
}

export class QuizViewModel {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public firstPlayerProgress: PlayerProgress;

  @ApiProperty({ nullable: true })
  public secondPlayerProgress: PlayerProgress | null;

  @ApiProperty({ nullable: true, type: QuestionInfo, isArray: true })
  public questions: QuestionInfo[] | null;

  @ApiProperty({ enum: QuizStatus })
  public status: QuizStatus;

  @ApiProperty()
  public pairCreatedDate: string;

  @ApiProperty({ nullable: true })
  public startGameDate: string | null;

  @ApiProperty({ nullable: true })
  public finishGameDate: string | null;

  constructor(
    id: string,
    firstPlayerProgress: PlayerProgress,
    secondPlayerProgress: PlayerProgress | null,
    questions: QuestionInfo[] | null,
    status: QuizStatus,
    pairCreatedDate: string,
    startGameDate: string | null,
    finishGameDate: string | null,
  ) {
    this.id = id;
    this.firstPlayerProgress = firstPlayerProgress;
    this.secondPlayerProgress = secondPlayerProgress;
    this.questions = questions;
    this.status = status;
    this.pairCreatedDate = pairCreatedDate;
    this.startGameDate = startGameDate;
    this.finishGameDate = finishGameDate;
  }
}
