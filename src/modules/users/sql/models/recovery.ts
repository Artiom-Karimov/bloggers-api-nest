export default class Recovery {
  constructor(
    public userId: string,
    public code: string,
    public expiration: Date,
  ) { }
}
