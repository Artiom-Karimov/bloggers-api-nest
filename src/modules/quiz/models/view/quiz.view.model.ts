import { PlayerProgress } from './player.progress';

export class QuestionInfo {
  constructor(public id: string, public body: string) { }
}
export enum QuizStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

export class QuizViewModel {
  public id: string;
  public firstPlayerProgress: PlayerProgress;
  public secondPlayerProgress: PlayerProgress | null;
  public questions: QuestionInfo[] | null;
  public status: QuizStatus;
  public pairCreatedDate: string;
  public startGameDate: string | null;
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
