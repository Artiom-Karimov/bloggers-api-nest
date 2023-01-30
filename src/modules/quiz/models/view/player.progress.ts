import { ApiProperty } from '@nestjs/swagger';

export class PlayerInfo {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public login: string;

  constructor(id: string, login: string) {
    this.id = id;
    this.login = login;
  }
}

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

export class AnswerInfo {
  @ApiProperty()
  public questionId: string;

  @ApiProperty({ enum: AnswerStatus })
  public answerStatus: AnswerStatus;

  @ApiProperty()
  public addedAt: string;

  constructor(questionId: string, answerStatus: AnswerStatus, addedAt: string) {
    this.questionId = questionId;
    this.answerStatus = answerStatus;
    this.addedAt = addedAt;
  }
}

export class PlayerProgress {
  @ApiProperty({ type: AnswerInfo, isArray: true })
  public answers: AnswerInfo[];

  @ApiProperty()
  public player: PlayerInfo;

  @ApiProperty()
  public score: number;

  constructor(answers: AnswerInfo[], player: PlayerInfo, score: number) {
    this.answers = answers;
    this.player = player;
    this.score = score;
  }
}
