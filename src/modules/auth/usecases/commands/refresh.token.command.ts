export type RefreshTokenData = {
  token: string;
  ip: string;
  deviceName: string;
};

export default class RefreshTokenCommand {
  constructor(public data: RefreshTokenData) { }
}
