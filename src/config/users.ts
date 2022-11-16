const confirmationMinutes = +process.env.emailConfirmationMinutes || 60;
const recoveryExpireMinutes = +process.env.passwordRecoveryExpireMinutes || 60;
const ddosMaxRequests = +process.env.ddosMaxRequests || 5;
const ddosTimeoutSeconds = +process.env.ddosTimeoutSeconds || 10;
const jwtSecret = process.env.jwtSecret || 'qwerty';
const ddosGuardDisable = process.env.ddosGuardDisable === 'true';

let accessExpireMinutes = +process.env.accessTokenExpireMinutes;
if (accessExpireMinutes == undefined) accessExpireMinutes = 5;

const accessExpireSeconds = +process.env.accessTokenExpireSeconds || 0;

let refreshExpireMinutes = +process.env.refreshTokenExpireMinutes;
if (refreshExpireMinutes == undefined) refreshExpireMinutes = 60;

const refreshExpireSeconds = +process.env.refreshTokenExpireSeconds || 0;

const accessExpireMillis =
  accessExpireMinutes * 60_000 + accessExpireSeconds * 1000;
const refreshExpireMillis =
  refreshExpireMinutes * 60_000 + refreshExpireSeconds * 1000;

export {
  confirmationMinutes,
  refreshExpireMillis,
  accessExpireMillis,
  recoveryExpireMinutes,
  ddosMaxRequests,
  ddosTimeoutSeconds,
  jwtSecret,
  ddosGuardDisable,
};
