export default class TokenPayload {
  constructor(
    public userId: string,
    public deviceId: string,
    public issuedAt: number,
    public exp: number,
  ) { }
}
