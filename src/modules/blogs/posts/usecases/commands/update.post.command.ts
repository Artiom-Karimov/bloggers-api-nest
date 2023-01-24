import PostInputModel from '../../models/post.input.model';

export class PostUpdateModel {
  constructor(
    public postId: string,
    public blogId: string,
    public bloggerId: string,
    public data: PostInputModel,
  ) { }
}

export default class UpdatePostCommand {
  constructor(public data: PostUpdateModel) { }
}
