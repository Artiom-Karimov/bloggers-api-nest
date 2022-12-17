export default class Like {
  constructor(
    public entityId: string,
    public userId: string,
    public userLogin: string,
    public userBanned: boolean,
    public status: string,
    public lastModified: Date,
  ) { }
}
