export default class User {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public hash: string,
    public createdAt: Date,
  ) { }
}
