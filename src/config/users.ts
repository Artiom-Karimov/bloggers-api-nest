const confirmationMinutes = +process.env.emailConfirmationMinutes || 60;
const refreshExpireMinutes = +process.env.refreshTokenExpireMinutes || 10;

export { confirmationMinutes, refreshExpireMinutes };
