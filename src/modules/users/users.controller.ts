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
  Query,
} from '@nestjs/common';
import PageViewModel from 'src/common/models/page.view.model';
import GetUsersQuery from './models/get.users.query';
import { UserInputModel } from './models/user.model';
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
  async create(@Body() data: UserInputModel): Promise<UserViewModel> {
    const created = await this.service.create(data);
    if (!created) throw new BadRequestException();
    const retrieved = this.queryRepo.getUser(created);
    if (!retrieved) throw new BadRequestException();
    return retrieved;
  }
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.service.delete(id);
    if (!deleted) throw new NotFoundException();
    return;
  }
}
