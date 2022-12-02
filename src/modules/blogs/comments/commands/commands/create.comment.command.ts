export type CommentCreateModel = {
  postId: string;
  userId: string;
  userLogin: string;
  content: string;
};

export default class CreateCommentCommand {
  constructor(public data: CommentCreateModel) { }
}
