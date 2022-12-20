export default class Comment {
  constructor(
    public id: string,
    public postId: string,
    public userId: string,
    public bannedByAdmin: boolean,
    public bannedByBlogger: boolean,
    public content: string,
    public createdAt: Date,
    public userLogin?: string,
  ) { }
}
