import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import PageViewModel from '../../common/models/page.view.model';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import UserBanInputModel from '../users/models/input/user.ban.input.model';
import GetUsersQuery from '../users/models/input/get.users.query';
import UserInputModel from '../users/models/input/user.input.model';
import UserViewModel from '../users/models/view/user.view.model';
import UsersQueryRepository from '../users/interfaces/users.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import BanUserCommand from '../users/usecases/commands/ban.user.command';
import CreateConfirmedUserCommand from '../users/usecases/commands/create.confirmed.user.command';
import DeleteUserCommand from '../users/usecases/commands/delete.user.command';
import IdParams from '../../common/models/id.param';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
@ApiTags('Users (for admin)')
@ApiBasicAuth()
export default class AdminUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) { }

  @Get('')
  async getUsers(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<UserViewModel>> {
    const query = new GetUsersQuery(reqQuery);
    return this.usersQueryRepo.getUsers(query);
  }
  @Get(':id')
  async getUser(@Param() params: IdParams): Promise<UserViewModel> {
    const user = await this.usersQueryRepo.getUser(params.id);
    if (!user) throw new NotFoundException();
    return user;
  }
  @Post('')
  async create(@Body() data: UserInputModel): Promise<UserViewModel> {
    const created = await this.commandBus.execute(
      new CreateConfirmedUserCommand(data),
    );

    const retrieved = this.usersQueryRepo.getUser(created);
    if (!retrieved) throw new BadRequestException();
    return retrieved;
  }
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() params: IdParams): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(params.id));
  }
  @Put(':id/ban')
  @HttpCode(204)
  async ban(@Param() params: IdParams, @Body() data: UserBanInputModel) {
    return this.commandBus.execute(
      new BanUserCommand({
        ...data,
        userId: params.id,
      }),
    );
  }
}
