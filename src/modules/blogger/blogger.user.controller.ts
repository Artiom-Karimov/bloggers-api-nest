import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import PageViewModel from '../../common/models/page.view.model';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import AdminBlogsQueryRepository from '../blogs/blogs/admin.blogs.query.repository';
import BlogUserBanQueryRepository from '../blogs/blogs/blog.user.ban.query.repository';
import BlogUserBanCommand from '../blogs/blogs/commands/commands/blog.user.ban.command';
import { BlogError } from '../blogs/blogs/models/blog.error';
import BlogUserBanInputModel from '../blogs/blogs/models/input/blog.user.ban.input.model';
import GetBlogUserBansQuery from '../blogs/blogs/models/input/get.blog.user.bans.query';
import BlogUserBanViewModel from '../blogs/blogs/models/view/blog.user.ban.view.model';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
export default class BloggerUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly banRepo: BlogUserBanQueryRepository,
    private readonly blogRepo: AdminBlogsQueryRepository,
  ) { }

  @Put(':id/ban')
  @HttpCode(204)
  public async putBan(
    @Param('id') userId: string,
    @Body() data: BlogUserBanInputModel,
    @User() blogger: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new BlogUserBanCommand({
        ...data,
        userId,
        bloggerId: blogger.userId,
      }),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Get('blog/:id')
  public async getBannedUsers(
    @Param('id') blogId: string,
    @User() blogger: TokenPayload,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    const blog = await this.blogRepo.getAdminBlog(blogId);
    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo?.userId !== blogger.userId)
      throw new ForbiddenException();

    const query = new GetBlogUserBansQuery(reqQuery, blogId);
    return this.banRepo.getUsers(query);
  }
}
