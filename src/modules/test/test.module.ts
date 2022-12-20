import { Module } from '@nestjs/common';
import TestController from './test.controller';
import TestRepository from './test.repository';
import SqlTestRepository from './repos/sql.test.repository';

@Module({
  controllers: [TestController],
  providers: [
    {
      provide: TestRepository,
      useClass: SqlTestRepository,
    },
  ],
})
export class TestModule { }
