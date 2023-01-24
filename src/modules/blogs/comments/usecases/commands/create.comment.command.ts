export type CommentCreateModel = {
  postId: string;
  userId: string;
  content: string;
};

export default class CreateCommentCommand {
  constructor(public data: CommentCreateModel) { }
}
