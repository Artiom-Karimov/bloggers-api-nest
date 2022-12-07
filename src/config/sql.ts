export const config = {
  type: process.env.sqlType || 'postgres',
  host: process.env.sqlHost || 'localhost',
  port: +process.env.sqlPort || 5432,
  username: process.env.sqlUser || 'postgres',
  password: process.env.sqlPass || 'postgres',
  database: process.env.sqlDatabase || 'bloggers',
  autoLoadEntities: false,
  synchronize: false,
};
