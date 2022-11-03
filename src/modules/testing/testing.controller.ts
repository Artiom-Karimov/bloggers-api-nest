import { Controller, Delete, HttpCode } from '@nestjs/common';
import TestingRepository from './testing.repository';

@Controller('testing')
export default class TestingController {
  constructor(private readonly repo: TestingRepository) { }

  @Delete('all-data')
  @HttpCode(204)
  async dropAll() {
    await this.repo.dropAll();
  }
}
