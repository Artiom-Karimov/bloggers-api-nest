export class QuestionViewModel {
  constructor(
    public id: string,
    public body: string,
    public corectAnswers: string[],
    public published: boolean,
    public createdAt: string,
    public updatedAt: string,
  ) { }
}
