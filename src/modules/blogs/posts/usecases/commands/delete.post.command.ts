export class PostDeleteModel {
  constructor(
    public blogId: string,
    public postId: string,
    public bloggerId: string,
  ) { }
}

export default class DeletePostCommand {
  constructor(public data: PostDeleteModel) { }
}
