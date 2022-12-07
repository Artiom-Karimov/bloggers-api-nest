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
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import PageViewModel from '../../common/models/page.view.model';
import { throwValidationException } from '../../common/utils/validation.options';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import AdminBlogViewModel from '../blogs/blogs/models/view/admin.blog.view.model';
import GetBlogsQuery from '../blogs/blogs/models/input/get.blogs.query';
import UserBanInputModel from '../users/models/input/user.ban.input.model';
import GetUsersQuery from '../users/models/input/get.users.query';
import UserInputModel from '../users/models/input/user.input.model';
import UserViewModel from '../users/models/view/user.view.model';
import UsersQueryRepository from '../users/mongoose/mongo.users.query.repository';
import { BlogError } from '../blogs/blogs/models/blog.error';
import BlogBanInputModel from '../blogs/blogs/models/input/blog.ban.input.model';
import { CommandBus } from '@nestjs/cqrs';
import BanBlogCommand from '../blogs/blogs/commands/commands/ban.blog.command';
import AdminBlogsQueryRepository from '../blogs/blogs/admin.blogs.query.repository';
import AssignBlogOwnerCommand from '../blogs/blogs/commands/commands/assign.blog.owner.command';
import BanUserCommand from './commands/commands/ban.user.command';
import CreateConfirmedUserCommand from './commands/commands/create.confirmed.user.command';
import DeleteUserCommand from './commands/commands/delete.user.command';
import { UserError } from '../users/user.error';

@Controller('sa')
@UseGuards(BasicAuthGuard)
export default class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepo: AdminBlogsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) { }

  @Get('blogs')
  async getBlogs(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getAdminBlogs(query);
  }
  @Put('blogs/:blogId/ban')
  @HttpCode(204)
  async banBlog(
    @Param('blogId') blogId: string,
    @Body() data: BlogBanInputModel,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new BanBlogCommand(blogId, data),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound)
      throwValidationException('id', 'blog not found');
    throw new BadRequestException();
  }
  @Put('blogs/:id/bind-with-user/:userId')
  @HttpCode(204)
  async assignBlogOwner(
    @Param('id') blogId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new AssignBlogOwnerCommand(userId, blogId),
    );

    if (result === BlogError.NoError) return;
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    if (result === BlogError.NotFound) throw new NotFoundException();
    throw new BadRequestException('unknown');
  }

  @Get('users')
  async getUsers(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<UserViewModel>> {
    const query = new GetUsersQuery(reqQuery);
    return this.usersQueryRepo.getUsers(query);
  }
  @Get('users/:id')
  async getUser(@Param('id') id: string): Promise<UserViewModel> {
    const user = await this.usersQueryRepo.getUser(id);
    if (!user) throw new NotFoundException();
    return user;
  }
  @Post('users')
  async create(@Body() data: UserInputModel): Promise<UserViewModel> {
    const created = await this.commandBus.execute(
      new CreateConfirmedUserCommand(data),
    );

    if (typeof created !== 'string') {
      if (created === UserError.LoginExists)
        throwValidationException('login', 'login already taken');
      if (created === UserError.EmailExists)
        throwValidationException('email', 'email already taken');
      throw new BadRequestException();
    }

    const retrieved = this.usersQueryRepo.getUser(created);
    if (!retrieved) throw new BadRequestException();
    return retrieved;
  }
  @Delete('users/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const result = await this.commandBus.execute(new DeleteUserCommand(id));
    if (result === UserError.NoError) return;
    if (result === UserError.NotFound) throw new NotFoundException();
    throw new BadRequestException();
  }
  @Put('users/:id/ban')
  @HttpCode(204)
  async ban(@Param('id') userId: string, @Body() data: UserBanInputModel) {
    const result = await this.commandBus.execute(
      new BanUserCommand({
        ...data,
        userId,
      }),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    throw new BadRequestException();
  }
}
