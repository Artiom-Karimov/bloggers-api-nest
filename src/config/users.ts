const confirmationMinutes = +process.env.emailConfirmationMinutes || 60;
const refreshExpireMinutes = +process.env.refreshTokenExpireMinutes || 10;
const recoveryExpireMinutes = +process.env.passwordRecoveryExpireMinutes || 60;

export { confirmationMinutes, refreshExpireMinutes, recoveryExpireMinutes };
