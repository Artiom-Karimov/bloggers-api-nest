export default class PostCreateModel {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public bloggerId: string,
    public blogName?: string,
  ) { }
}
