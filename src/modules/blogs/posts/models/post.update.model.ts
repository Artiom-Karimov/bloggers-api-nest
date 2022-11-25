import PostInputModel from './post.input.model';

export default class PostUpdateModel {
  constructor(
    public postId: string,
    public blogId: string,
    public bloggerId: string,
    public data: PostInputModel,
  ) { }
}
