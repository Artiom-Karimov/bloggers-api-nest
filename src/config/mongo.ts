const mongoUri: string =
  process.env.mongoUri || 'mongodb://0.0.0.0:27017/bloggers';

export { mongoUri };
