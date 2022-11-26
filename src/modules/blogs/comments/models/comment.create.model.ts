export default class CommentCreateModel {
  constructor(
    public postId: string,
    public userId: string,
    public userLogin: string,
    public content: string,
  ) { }
}
