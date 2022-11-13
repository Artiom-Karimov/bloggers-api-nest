export enum AuthError {
  NoError,
  Unknown,
  LoginExists,
  EmailExists,
  InvalidCode,
  WrongCredentials,
  AlreadyConfirmed,
  Unconfirmed,
  Banned,
  NotFound,
}
