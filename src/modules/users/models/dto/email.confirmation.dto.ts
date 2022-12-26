export class EmailConfirmationDto {
  constructor(
    public userId: string,
    public confirmed: boolean,
    public code: string,
    public expiration: Date,
  ) { }
}
