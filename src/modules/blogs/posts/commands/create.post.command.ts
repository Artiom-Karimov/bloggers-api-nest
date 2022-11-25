import PostCreateModel from '../models/post.create.model';

export default class CreatePostCommand {
  constructor(public data: PostCreateModel) { }
}
