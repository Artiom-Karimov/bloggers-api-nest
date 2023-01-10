const port: number = +process.env.PORT || 3000;
const baseUrl: string = process.env.baseUrl || `http://localhost:${port}`;
const enableTesting = process.env.enableTesting === 'true';

export { port, baseUrl, enableTesting };
