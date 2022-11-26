export default class CommentUpdateModel {
  constructor(
    public commentId: string,
    public userId: string,
    public content: string,
  ) { }
}
