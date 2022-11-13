export default class TokenPayload {
  constructor(
    public userId: string,
    public userLogin: string,
    public deviceId: string,
    public exp: number,
  ) { }
}
