export class PostCreateModel {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public bloggerId: string,
    public blogName?: string,
  ) { }
}

export default class CreatePostCommand {
  constructor(public data: PostCreateModel) { }
}
