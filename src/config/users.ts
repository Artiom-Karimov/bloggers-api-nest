const confirmationMinutes = +process.env.emailConfirmationMinutes || 60;
const refreshExpireMinutes = +process.env.refreshTokenExpireMinutes || 10;
const accessExpireMinutes = +process.env.accessExpireMinutes || 5;
const recoveryExpireMinutes = +process.env.passwordRecoveryExpireMinutes || 60;
const ddosMaxRequests = +process.env.ddosMaxRequests || 5;
const ddosTimeoutSeconds = +process.env.ddosTimeoutSeconds || 10;
const jwtSecret = process.env.jwtSecret || 'qwerty';

export {
  confirmationMinutes,
  refreshExpireMinutes,
  accessExpireMinutes,
  recoveryExpireMinutes,
  ddosMaxRequests,
  ddosTimeoutSeconds,
  jwtSecret,
};
