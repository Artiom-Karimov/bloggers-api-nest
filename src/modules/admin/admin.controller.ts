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
import { throwValidationException } from '../../common/utils/validation.options';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import BlogsQueryRepository from '../blogs/blogs.query.repository';
import BlogsService, { BlogError } from '../blogs/blogs.service';
import AdminBlogViewModel from '../blogs/models/admin.blog.view.model';
import GetBlogsQuery from '../blogs/models/get.blogs.query';
import UserBanInputModel from '../users/models/ban/user.ban.input.model';
import GetUsersQuery from '../users/models/get.users.query';
import UserInputModel from '../users/models/user.input.model';
import UserViewModel from '../users/models/user.view.model';
import UsersQueryRepository from '../users/users.query.repository';
import UsersService from '../users/users.service';

@Controller('sa')
@UseGuards(BasicAuthGuard)
export default class AdminController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly usersService: UsersService,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) { }

  @Get('blogs')
  async getBlogs(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getAdminBlogs(query);
  }
  @Put('blogs/:id/bind-with-user/:userId')
  @HttpCode(204)
  async assignBlogOwner(
    @Param('id') blogId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const user = await this.usersQueryRepo.getUser(userId);
    if (!user) throwValidationException('userId', 'user not found');

    const result = await this.blogsService.assignOwner(blogId, {
      userId: user.id,
      userLogin: user.login,
    });
    if (result === BlogError.NoError) return;
    if (result === BlogError.Forbidden)
      throwValidationException('id', 'blog already has owner');
    if (result === BlogError.NotFound)
      throwValidationException('id', 'blog not found');
    throw new BadRequestException('unknown');
  }

  @Get('users')
  async getUsers(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<UserViewModel>> {
    const query = new GetUsersQuery(reqQuery);
    return this.usersQueryRepo.getUsers(query);
  }
  @Post('users')
  async create(@Body() data: UserInputModel): Promise<UserViewModel> {
    await this.checkLoginEmailExists(data.login, data.email);
    const created = await this.usersService.createConfirmed(data);
    if (!created) throw new BadRequestException();
    const retrieved = this.usersQueryRepo.getUser(created);
    if (!retrieved) throw new BadRequestException();
    return retrieved;
  }
  @Delete('users/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.usersService.delete(id);
    if (!deleted) throw new NotFoundException();
    return;
  }
  @Put(':id/ban')
  @HttpCode(204)
  async ban(@Param('id') id: string, @Body() data: UserBanInputModel) {
    data.userId = id;
    const result = await this.usersService.putBanInfo(data);
    if (!result) throw new NotFoundException();
    return;
  }

  private async checkLoginEmailExists(
    login: string,
    email: string,
  ): Promise<void> {
    const loginExists = await this.usersService.loginOrEmailExists(login);
    if (loginExists) throwValidationException('login', 'login already exists');
    const emailExists = await this.usersService.loginOrEmailExists(email);
    if (emailExists) throwValidationException('email', 'email already exists');
  }
}
