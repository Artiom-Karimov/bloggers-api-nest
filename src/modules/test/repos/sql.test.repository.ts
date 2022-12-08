import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import TestRepository from '../test.repository';

@Injectable()
export default class SqlTestRepository extends TestRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async dropAll(): Promise<void> {
    await this.db.query(`
    delete from "user";
    `);
  }
}
