const user = process.env.emailUser;
const pass = process.env.emailPassword;
const senderName = process.env.mailSenderName || 'Noreply';
const confirmLink =
  process.env.emailConfirmLink ||
  'http://localhost:3000/auth/registration-confirmation';
const recoverLink =
  process.env.passwordRecoverLink || 'http://localhost:3000/auth/new-password';

export { user, pass, senderName, confirmLink, recoverLink };
