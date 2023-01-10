import { Controller, Delete, HttpCode } from '@nestjs/common';
import TestRepository from './test.repository';
import * as config from '../../config/root';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Controller('testing')
export default class TestController {
  constructor(private readonly repo: TestRepository) { }

  @Delete('all-data')
  @HttpCode(204)
  async dropAll() {
    if (config.enableTesting) {
      await this.repo.dropAll();
      return;
    }
    throw new ForbiddenException('Testing disabled');
  }
}
