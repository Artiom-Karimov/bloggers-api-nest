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
import { BlogError } from '../blogs/blogs/models/blog.error';
import BlogBanInputModel from '../blogs/blogs/models/input/blog.ban.input.model';
import { CommandBus } from '@nestjs/cqrs';
import BanBlogCommand from '../blogs/blogs/usecases/commands/ban.blog.command';
import AdminBlogsQueryRepository from '../blogs/blogs/interfaces/admin.blogs.query.repository';
import IdParams from '../../common/models/id.param';
import AssignBlogOwnerCommand from '../blogs/blogs/usecases/commands/assign.blog.owner.command';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
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
    const result = await this.commandBus.execute(
      new BanBlogCommand(params.blogId, data),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound)
      throwValidationException('id', 'blog not found');
    throw new BadRequestException();
  }
  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async assignBlogOwner(@Param() params: IdParams): Promise<void> {
    const result = await this.commandBus.execute(
      new AssignBlogOwnerCommand(params.userId, params.blogId),
    );

    if (result === BlogError.NoError) return;
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    if (result === BlogError.NotFound) throw new NotFoundException();
    throw new BadRequestException('unknown');
  }
}
