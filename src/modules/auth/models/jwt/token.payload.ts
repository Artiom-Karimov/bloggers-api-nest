export default class TokenPayload {
  constructor(
    public userId: string,
    public deviceId: string,
    public exp: number,
  ) { }
}