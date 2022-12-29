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

    delete from "blog_user_ban";
    delete from "blog_ban";
    delete from "blog";

    delete from "session";
    delete from "recovery"; 
    delete from "email_confirmation"; 
    delete from "user_ban";
    delete from "user";
    `);
  }
}
