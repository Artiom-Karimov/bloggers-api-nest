import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger/dist/decorators';

@Controller()
@ApiTags('Root endpoint')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Can be used to check/ping the API' })
  getHello(): string {
    return this.appService.getHello();
  }
}
