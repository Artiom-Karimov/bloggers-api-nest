const secret = process.env.jwtSecret || 'qwerty';
const accessExpireSeconds = +process.env.jwtAccessExpireSeconds || 10;
const refreshExpireSeconds = +process.env.jwtRefreshExpireSeconds || 20;

export { secret, accessExpireSeconds, refreshExpireSeconds };
