import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import PageViewModel from '../../common/models/page.view.model';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import AdminBlogViewModel from '../blogs/blogs/models/view/admin.blog.view.model';
import GetBlogsQuery from '../blogs/blogs/models/input/get.blogs.query';
import BlogBanInputModel from '../blogs/blogs/models/input/blog.ban.input.model';
import { CommandBus } from '@nestjs/cqrs';
import BanBlogCommand from '../blogs/blogs/usecases/commands/ban.blog.command';
import AdminBlogsQueryRepository from '../blogs/blogs/interfaces/admin.blogs.query.repository';
import IdParams from '../../common/models/id.param';
import AssignBlogOwnerCommand from '../blogs/blogs/usecases/commands/assign.blog.owner.command';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { AdminBlogPage } from '../swagger/models/pages';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
@ApiTags('Blogs (for admin)')
@ApiBasicAuth()
export default class AdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepo: AdminBlogsQueryRepository,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get all blogs with pagination' })
  @ApiQuery({ type: GetBlogsQuery })
  @ApiResponse({ status: 200, description: 'Success', type: AdminBlogPage })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBlogs(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getAdminBlogs(query);
  }

  @Put(':blogId/ban')
  @HttpCode(204)
  @ApiOperation({ summary: 'Ban/unban blog' })
  @ApiParam({ name: 'blogId' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async banBlog(
    @Param() params: IdParams,
    @Body() data: BlogBanInputModel,
  ): Promise<void> {
    return this.commandBus.execute(new BanBlogCommand(params.blogId, data));
  }

  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Assign blog owner if it has no owner' })
  @ApiParam({ name: 'blogId' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Blog already has an owner' })
  @ApiResponse({ status: 404, description: 'Blog or user not found' })
  async assignBlogOwner(@Param() params: IdParams): Promise<void> {
    return this.commandBus.execute(
      new AssignBlogOwnerCommand(params.userId, params.blogId),
    );
  }
}
