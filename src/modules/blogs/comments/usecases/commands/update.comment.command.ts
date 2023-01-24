export type CommentUpdateModel = {
  commentId: string;
  userId: string;
  content: string;
};

export default class UpdateCommentCommand {
  constructor(public data: CommentUpdateModel) { }
}
