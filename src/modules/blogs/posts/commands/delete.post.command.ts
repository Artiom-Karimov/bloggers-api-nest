import PostDeleteModel from '../models/post.delete.model';

export default class DeletePostCommand {
  constructor(public data: PostDeleteModel) { }
}
