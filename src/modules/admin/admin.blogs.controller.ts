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
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
@ApiTags('Blogs (for admin)')
@ApiBasicAuth()
export default class AdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepo: AdminBlogsQueryRepository,
  ) { }

  @Get('')
  async getBlogs(
    @Query() reqQuery: any,
  ): Promise<PageViewModel<AdminBlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getAdminBlogs(query);
  }
  @Put(':blogId/ban')
  @HttpCode(204)
  async banBlog(
    @Param() params: IdParams,
    @Body() data: BlogBanInputModel,
  ): Promise<void> {
    return this.commandBus.execute(new BanBlogCommand(params.blogId, data));
  }
  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async assignBlogOwner(@Param() params: IdParams): Promise<void> {
    return this.commandBus.execute(
      new AssignBlogOwnerCommand(params.userId, params.blogId),
    );
  }
}
