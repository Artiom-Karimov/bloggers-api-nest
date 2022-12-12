export default class CommentDto {
  constructor(
    public id: string,
    public postId: string,
    public userId: string,
    public userLogin: string,
    public bannedByAdmin: boolean,
    public bannedByBlogger: boolean,
    public content: string,
    public createdAt: string,
  ) { }
}
