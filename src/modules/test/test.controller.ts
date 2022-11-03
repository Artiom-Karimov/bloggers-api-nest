import { Controller, Delete, HttpCode } from '@nestjs/common';
import TestRepository from './test.repository';

@Controller('testing')
export default class TestController {
  constructor(private readonly repo: TestRepository) { }

  @Delete('all-data')
  @HttpCode(204)
  async dropAll() {
    await this.repo.dropAll();
  }
}
