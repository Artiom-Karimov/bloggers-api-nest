const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;
const baseUrl: string = process.env.baseUrl || `http://localhost:${port}`;

export { port, baseUrl };
