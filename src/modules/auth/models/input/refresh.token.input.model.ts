export default class RefreshTokenInputModel {
  constructor(
    public token: string,
    public ip: string,
    public deviceName: string,
  ) { }
}
