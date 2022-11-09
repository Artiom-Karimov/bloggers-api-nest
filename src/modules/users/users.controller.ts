import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import PageViewModel from '../../common/models/page.view.model';
import GetUsersQuery from './models/get.users.query';
import UserBanInputModel from './models/ban/user.ban.input.model';
import UserInputModel from './models/user.input.model';
import UserViewModel from './models/user.view.model';
import UsersQueryRepository from './users.query.repository';
import UsersService from './users.service';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly queryRepo: UsersQueryRepository,
  ) { }

  @Get()
  async get(@Query() reqQuery: any): Promise<PageViewModel<UserViewModel>> {
    const query = new GetUsersQuery(reqQuery);
    return this.queryRepo.getUsers(query);
  }
  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() data: UserInputModel): Promise<UserViewModel> {
    const created = await this.service.createConfirmed(data);
    if (!created) throw new BadRequestException();
    const retrieved = this.queryRepo.getUser(created);
    if (!retrieved) throw new BadRequestException();
    return retrieved;
  }
  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.service.delete(id);
    if (!deleted) throw new NotFoundException();
    return;
  }
  @Put(':id/ban')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async ban(@Param('id') id: string, @Body() data: UserBanInputModel) {
    data.userId = id;
    const result = await this.service.putBanInfo(data);
    if (!result) throw new NotFoundException();
    return;
  }
}
