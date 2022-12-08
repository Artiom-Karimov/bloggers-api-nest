export default class EmailConfirmation {
  constructor(
    public userId: string,
    public confirmed: boolean,
    public code: string,
    public expiration: Date,
  ) { }
}
