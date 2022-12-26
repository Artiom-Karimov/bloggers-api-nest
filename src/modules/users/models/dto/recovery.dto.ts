export class RecoveryDto {
  constructor(
    public userId: string,
    public code: string,
    public expiration: Date,
  ) { }
}
