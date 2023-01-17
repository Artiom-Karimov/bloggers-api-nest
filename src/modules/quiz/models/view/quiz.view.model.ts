export class AnswerInfo {
  constructor(
    public questionId: string,
    public answerStatus: 'Correct' | 'Incorrect',
    public addedAt: string,
  ) { }
}
export class PlayerInfo {
  constructor(public id: string, public login: string) { }
}
export class QuestionInfo {
  constructor(public id: string, public body: string) { }
}
export class PlayerProgress {
  constructor(
    public answers: AnswerInfo[],
    public player: PlayerInfo,
    public score: number,
  ) { }
}

export class QuizViewModel {
  constructor(
    public id: string,
    public firstPlayerProgress: PlayerProgress,
    public secondPlayerProgress: PlayerProgress | null,
    public questions: QuestionInfo[] | null,
    public status: 'PendingSecondPlayer' | 'Active' | 'Finished',
    public pairCreatedDate: string,
    public startGameDate: string | null,
    public finishGameDate: string | null,
  ) { }
}
