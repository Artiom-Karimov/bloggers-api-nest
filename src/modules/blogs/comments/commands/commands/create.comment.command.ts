import CommentCreateModel from '../../models/input/comment.create.model';

export default class CreateCommentCommand {
  constructor(public data: CommentCreateModel) { }
}
