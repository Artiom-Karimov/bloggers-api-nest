export class SessionDto {
  constructor(
    public deviceId: string,
    public deviceName: string,
    public ip: string,
    public userId: string,
    public userLogin: string,
    public issuedAt: Date,
    public expiresAt: Date,
  ) { }
}
