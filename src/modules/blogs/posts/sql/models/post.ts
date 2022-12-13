export default class Post {
  constructor(
    public id: string,
    public blogId: string,
    public blogBanned: boolean,
    public title: string,
    public shortDescription: string,
    public content: string,
    public createdAt: Date,
  ) { }
}
