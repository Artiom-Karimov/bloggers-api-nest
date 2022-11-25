import PostUpdateModel from '../models/post.update.model';

export default class UpdatePostCommand {
  constructor(public data: PostUpdateModel) { }
}
