import { Controller, Delete, HttpCode } from '@nestjs/common';
import TestRepository from './test.repository';
import * as config from '../../config/root';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ApiOperation, ApiTags } from '@nestjs/swagger/dist/decorators';

@Controller('testing')
@ApiTags('Testing')
export default class TestController {
  constructor(private readonly repo: TestRepository) { }

  @Delete('all-data')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Clear entire db - disabled by default',
    description: 'Used in development mode to reset all tables',
  })
  async dropAll() {
    if (config.enableTesting) {
      await this.repo.dropAll();
      return;
    }
    throw new ForbiddenException('Testing disabled');
  }
}
