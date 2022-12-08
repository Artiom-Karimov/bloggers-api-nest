export default class UserWithBan {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public hash: string,
    public createdAt: Date,
    public isBanned?: boolean,
    public banReason?: string,
    public banDate?: Date,
  ) { }
}
