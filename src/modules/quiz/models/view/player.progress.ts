export class PlayerInfo {
  constructor(public id: string, public login: string) { }
}

export class AnswerInfo {
  public questionId: string;
  public answerStatus: 'Correct' | 'Incorrect';
  public addedAt: string;

  constructor(
    questionId: string,
    answerStatus: 'Correct' | 'Incorrect',
    addedAt: string,
  ) {
    this.questionId = questionId;
    this.answerStatus = answerStatus;
    this.addedAt = addedAt;
  }
}

export class PlayerProgress {
  constructor(
    public answers: AnswerInfo[],
    public player: PlayerInfo,
    public score: number,
  ) { }
}
