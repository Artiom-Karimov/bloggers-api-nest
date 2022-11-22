import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import PageViewModel from '../../common/models/page.view.model';
import { throwValidationException } from '../../common/utils/validation.options';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import BlogsQueryRepository from '../blogs/blogs.query.repository';
import BlogsService, { BlogError } from '../blogs/blogs.service';
import AdminBlogViewModel from '../blogs/models/admin.blog.view.model';
import GetBlogsQuery from '../blogs/models/get.blogs.query';
import UsersQueryRepository from '../users/users.query.repository';
import UsersService from '../users/users.service';

@Controller('sa')
export default class AdminController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly usersService: UsersService,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) { }

  @Get('blogs')
  @UseGuards(BasicAuthGuard)
  async getBlogs(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getAdminBlogs(query);
  }
  @Put('blogs/:id/bind-with-user/:userId')
  @UseGuards(BasicAuthGuard)
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
}
