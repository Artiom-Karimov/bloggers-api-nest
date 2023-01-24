export type LoginData = {
  loginOrEmail: string;
  password: string;
  ip: string;
  deviceName: string;
};

export default class LoginCommand {
  constructor(public data: LoginData) { }
}
