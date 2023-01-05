import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.sqlHost || 'localhost',
  port: +process.env.sqlPort || 5432,
  username: process.env.sqlUser || 'postgres',
  password: process.env.sqlPass || 'postgres',
  database: process.env.sqlDatabase || 'bloggers',
  autoLoadEntities: true,
  synchronize: true,
  extra: { poolSize: +process.env.sqlConnections || 4 },
};
