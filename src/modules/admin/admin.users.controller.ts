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
import {
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { AdminUserPage } from '../swagger/models/pages';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
@ApiTags('Users (for admin)')
@ApiBasicAuth()
export default class AdminUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ type: GetUsersQuery })
  @ApiResponse({ status: 200, description: 'Success', type: AdminUserPage })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsers(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<UserViewModel>> {
    const query = new GetUsersQuery(reqQuery);
    return this.usersQueryRepo.getUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Success', type: UserViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param() params: IdParams): Promise<UserViewModel> {
    const user = await this.usersQueryRepo.getUser(params.id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Create user without email confirmation' })
  @ApiResponse({
    status: 201,
    description: 'Success, returns created user',
    type: UserViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'Illegal values received or user already exists',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Delete existing user' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@Param() params: IdParams): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(params.id));
  }

  @Put(':id/ban')
  @HttpCode(204)
  @ApiOperation({ summary: 'Bun/unban user for the entire service' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async ban(@Param() params: IdParams, @Body() data: UserBanInputModel) {
    return this.commandBus.execute(
      new BanUserCommand({
        ...data,
        userId: params.id,
      }),
    );
  }
}
