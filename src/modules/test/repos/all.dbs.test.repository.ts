import { Injectable } from '@nestjs/common';
import TestRepository from '../test.repository';
import MongoTestRepository from './mongo.test.repositoty';
import SqlTestRepository from './sql.test.repository';

@Injectable()
export default class AllDbsTestRepository extends TestRepository {
  constructor(
    private readonly mongoRepo: MongoTestRepository,
    private readonly sqlRepo: SqlTestRepository,
  ) {
    super();
  }
  public async dropAll(): Promise<void> {
    await this.mongoRepo.dropAll();
    await this.sqlRepo.dropAll();
  }
}
